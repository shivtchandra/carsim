"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Map, Eye, RotateCcw, Gamepad2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getBrand, getModel, getVariant } from "@/lib/data";
import { getVehicleDNA } from "@/lib/vehicle-dna";
import { getTopDownCollisionHalfExtents, TOP_DOWN_REF } from "@/lib/carTopDownAssets";
import { SCENE_COLORS } from "@/components/understanding/scenes/shared/sceneTokens";
import VariantSelect from "./VariantSelect";
import TopDownCarSprite from "./TopDownCarSprite";

export default function CityDriving({ initialVariant }: { initialVariant?: string }) {
  const [id, setId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("drivescope_selected_variant");
      if (stored) return stored;
    }
    return initialVariant ?? "creta-sx-o-turbo-dct";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("drivescope_selected_variant");
      if (stored && stored !== id) {
        setId(stored);
      }
    }
  }, []);
  const [testType, setTestType] = useState<"uturn" | "parking">("uturn");
  
  // Game mode: auto (passive animation) or interactive (playable)
  const [driveMode, setDriveMode] = useState<"auto" | "interactive">("interactive");
  const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "crashed" | "success" | "completed">("idle");
  const [pedalGas, setPedalGas] = useState(false);
  const [pedalBrake, setPedalBrake] = useState(false);
  const [isNearObstacle, setIsNearObstacle] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // References for smooth 60 FPS animation/physics loops
  const stateRef = useRef({ t: 0, last: 0, raf: 0 });
  const carXRef = useRef(100);
  const carYRef = useRef(150);
  const angleDegRef = useRef(0);
  const speedRef = useRef(0);
  const steeringAngleRef = useRef(0);
  const steeringWheelAngleRef = useRef(0);
  const gearRef = useRef<"P" | "R" | "N" | "D">("P");
  
  const gameStatusRef = useRef<"idle" | "playing" | "crashed" | "success" | "completed">("idle");
  const isDraggingWheelRef = useRef(false);
  const isNearObstacleRef = useRef(false);
  const mouseGasPressedRef = useRef(false);
  const mouseBrakePressedRef = useRef(false);
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});

  const v = getVariant(id);
  const m = v && getModel(v.modelId);
  const brand = m ? getBrand(m.brandId) : null;
  const vehicleDna = m ? getVehicleDNA(m) : undefined;

  const lengthMm = m?.dimensions.lengthMm ?? TOP_DOWN_REF.lengthMm;
  const widthMm = m?.dimensions.widthMm ?? TOP_DOWN_REF.widthMm;
  const { halfLength: carHalfL, halfWidth: carHalfW } = getTopDownCollisionHalfExtents(lengthMm, widthMm);
  const carColor = brand?.color ?? SCENE_COLORS.accent;

  // Estimating dimensions and turning radius based on wheelbase
  const wheelbaseMm = m?.dimensions.wheelbaseMm ?? 2610;
  const trans = v?.transmission ?? "MT";
  
  // Turning radius: between 5.0m and 5.5m typically
  const turningRadius = 5.0 + ((wheelbaseMm - 2400) / 1000) * 1.5;
  const isAuto = trans !== "MT";
  
  // Gear positions for shifter visual mapping
  const gearPositions = {
    P: 60,
    R: 86,
    N: 113,
    D: 140
  };

  // City Friendliness Score Calculation
  const cityScore = (() => {
    let score = 8.5;
    if (turningRadius > 5.3) score -= 1.0;
    else if (turningRadius < 5.15) score += 0.5;
    
    if (isAuto) score += 1.0;
    else score -= 1.0;

    if (m?.segment === "sub-4m-suv" || m?.segment === "compact-hatch") score += 0.5;
    else if (m?.bodyStyle === "sedan") score -= 0.3;

    return Math.max(4.0, Math.min(9.8, score));
  })();

  const [simState, setSimState] = useState({
    carX: 100,
    carY: 150,
    angleDeg: 0,
    speed: 0,
    steeringAngle: 0,
    gear: "P" as "P" | "R" | "N" | "D",
    gameStatus: "idle" as "idle" | "playing" | "crashed" | "success" | "completed",
  });

  // Check collision against boundary curbs, parked cars, or median island
  const checkCollisions = (cx: number, cy: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const halfL = carHalfL;
    const halfW = carHalfW;

    const corners = [
      { x: cx + halfL * cos - halfW * sin, y: cy + halfL * sin + halfW * cos },
      { x: cx + halfL * cos + halfW * sin, y: cy + halfL * sin - halfW * cos },
      { x: cx - halfL * cos - halfW * sin, y: cy - halfL * sin + halfW * cos },
      { x: cx - halfL * cos + halfW * sin, y: cy - halfL * sin - halfW * cos }
    ];

    const minX = 122; // dashboard panels cover x = 0..120 and 580..700
    const maxX = 578;
    const minY = 10;
    const maxY = 190;

    for (const pt of corners) {
      if (pt.x < minX || pt.x > maxX || pt.y < minY || pt.y > maxY) {
        return true;
      }

      if (testType === "uturn") {
        // Median Island collision check (x: 250..450, y: 90..110)
        if (pt.x >= 248 && pt.x <= 452 && pt.y >= 88 && pt.y <= 112) {
          return true;
        }
      } else {
        // Parallel parking obstacles collision check
        // Parked Sedan: x = 240..320, y = 115..145
        if (pt.x >= 236 && pt.x <= 324 && pt.y >= 111 && pt.y <= 149) {
          return true;
        }
        // Parked SUV: x = 440..520, y = 115..145
        if (pt.x >= 436 && pt.x <= 524 && pt.y >= 111 && pt.y <= 149) {
          return true;
        }
        // Curb limit (outside parking slot)
        if (pt.x < 330 || pt.x > 430) {
          if (pt.y > 146) return true;
        } else {
          // Inside parking slot (sidewalk edge hit)
          if (pt.y > 148) return true;
        }
      }
    }
    return false;
  };

  // Check if proximity warning (radar flashing) should trigger
  const checkProximity = (cx: number, cy: number) => {
    if (testType === "uturn") {
      const distMedian = Math.hypot(cx - 350, cy - 100);
      if (distMedian < 60 && cx >= 230 && cx <= 470) return true;
    } else {
      const distSedan = Math.hypot(cx - 280, cy - 130);
      const distSuv = Math.hypot(cx - 480, cy - 130);
      if (distSedan < 55 || distSuv < 55) return true;
      if (cy > 132) return true;
    }
    // Proximity to road boundaries
    if (cx < 140 || cx > 560 || cy < 25 || cy > 175) return true;
    return false;
  };

  // Verify if success criteria are met
  const checkSuccess = (cx: number, cy: number, angleDeg: number, speed: number, gear: string) => {
    if (testType === "uturn") {
      // Completed U-Turn: reached top lane going left
      const isHeadingLeft = Math.abs(Math.abs(angleDeg) - 180) <= 25;
      if (cy < 85 && cx < 180 && isHeadingLeft) {
        return true;
      }
    } else {
      // Parallel parking: car fully inside vacant slot, stopped, parallel, and in Park (P)
      if (speed === 0 && gear === "P") {
        const rad = (angleDeg * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const halfL = carHalfL * 1.05;
        const halfW = carHalfW;
        const corners = [
          { x: cx + halfL * cos - halfW * sin, y: cy + halfL * sin + halfW * cos },
          { x: cx + halfL * cos + halfW * sin, y: cy + halfL * sin - halfW * cos },
          { x: cx - halfL * cos - halfW * sin, y: cy - halfL * sin + halfW * cos },
          { x: cx - halfL * cos + halfW * sin, y: cy - halfL * sin - halfW * cos }
        ];

        const allInsideX = corners.every(pt => pt.x >= 328 && pt.x <= 432);
        const allInsideY = corners.every(pt => pt.y >= 115 && pt.y <= 147);
        const isParallel = Math.abs(angleDeg) <= 8 || Math.abs(Math.abs(angleDeg) - 180) <= 8;

        if (allInsideX && allInsideY && isParallel) {
          return true;
        }
      }
    }
    return false;
  };

  const handleGearChange = (newGear: "P" | "R" | "N" | "D") => {
    if (gameStatusRef.current === "crashed" || gameStatusRef.current === "success" || gameStatusRef.current === "completed") return;
    gearRef.current = newGear;
    setSimState(prev => ({ ...prev, gear: newGear }));
  };

  const resetSimulation = () => {
    const isUturn = testType === "uturn";
    const startX = isUturn ? 150 : 480; // offset slightly inside road area
    const startY = isUturn ? 150 : 80;
    const startAngle = 0;

    carXRef.current = startX;
    carYRef.current = startY;
    angleDegRef.current = startAngle;
    speedRef.current = 0;
    steeringAngleRef.current = 0;
    steeringWheelAngleRef.current = 0;
    gearRef.current = isUturn ? "D" : "P";
    gameStatusRef.current = "idle";
    
    setGameStatus("idle");
    setElapsedTime(0);
    setIsNearObstacle(false);
    isNearObstacleRef.current = false;
    mouseGasPressedRef.current = false;
    mouseBrakePressedRef.current = false;
    setPedalGas(false);
    setPedalBrake(false);

    setSimState({
      carX: startX,
      carY: startY,
      angleDeg: startAngle,
      speed: 0,
      steeringAngle: 0,
      gear: isUturn ? "D" : "P",
      gameStatus: "idle",
    });

    if (stateRef.current.raf) {
      cancelAnimationFrame(stateRef.current.raf);
    }
    stateRef.current = { t: 0, last: 0, raf: 0 };
  };

  // Run auto mode passive simulation
  const runAutoSimulation = () => {
    resetSimulation();
    gameStatusRef.current = "playing";
    setGameStatus("playing");
    stateRef.current.last = performance.now();
    stateRef.current.t = 0;

    const testDuration = 5.0;

    const loop = (now: number) => {
      if (stateRef.current.last === 0) {
        stateRef.current.last = now;
      }
      const dt = (now - stateRef.current.last) / 1000;
      stateRef.current.last = now;
      stateRef.current.t += dt;
      const t = stateRef.current.t;
      setElapsedTime(t);

      const progress = Math.min(t / testDuration, 1);
      let carX = 150;
      let carY = 150;
      let angleDeg = 0;

      if (testType === "uturn") {
        const rPx = turningRadius * 12;
        const cx = 350;
        const cy = 110;
        
        if (progress < 0.2) {
          const p = progress / 0.2;
          carX = cx - rPx + p * 30;
          carY = cy + rPx;
          angleDeg = 0;
        } else if (progress >= 0.2 && progress < 0.8) {
          const p = (progress - 0.2) / 0.6;
          const theta = Math.PI / 2 - p * Math.PI;
          carX = cx + rPx * Math.cos(theta);
          carY = cy + rPx * Math.sin(theta);
          angleDeg = -p * 180;
        } else {
          const p = (progress - 0.8) / 0.2;
          carX = cx - rPx - p * 50;
          carY = cy - rPx;
          angleDeg = -180;
        }
      } else {
        // Parallel parking
        const startX = 480;
        const startY = 80;
        
        if (progress < 0.35) {
          const p = progress / 0.35;
          carX = startX + p * 80;
          carY = startY;
          angleDeg = 0;
        } else if (progress >= 0.35 && progress < 0.75) {
          const p = (progress - 0.35) / 0.4;
          carX = startX + 80 - p * 110;
          carY = startY + p * 55;
          angleDeg = Math.sin(p * Math.PI) * 28;
        } else {
          const p = (progress - 0.75) / 0.25;
          carX = startX - 30 - p * 30;
          carY = startY + 55;
          angleDeg = 0;
        }
      }

      carXRef.current = carX;
      carYRef.current = carY;
      angleDegRef.current = angleDeg;

      const finished = progress >= 1;
      const status = finished ? "completed" : "playing";
      gameStatusRef.current = status;
      setGameStatus(status);

      setSimState({
        carX,
        carY,
        angleDeg,
        speed: 0,
        steeringAngle: 0,
        gear: "D",
        gameStatus: status,
      });

      if (finished) {
        cancelAnimationFrame(stateRef.current.raf);
        return;
      }

      stateRef.current.raf = requestAnimationFrame(loop);
    };

    stateRef.current.raf = requestAnimationFrame(loop);
  };

  // Start Interactive Mode driving
  const startInteractiveDriving = () => {
    resetSimulation();
    gameStatusRef.current = "playing";
    setGameStatus("playing");
    stateRef.current.last = performance.now();
    stateRef.current.raf = requestAnimationFrame(interactiveLoop);
  };

  // 60FPS Interactive Physics Game Loop
  const interactiveLoop = (now: number) => {
    if (gameStatusRef.current !== "playing") return;

    if (stateRef.current.last === 0) {
      stateRef.current.last = now;
    }
    const dt = Math.min((now - stateRef.current.last) / 1000, 0.1);
    stateRef.current.last = now;

    // 1. Steering calculations & auto centering
    let isSteering = false;
    const steerSpeed = 160 * dt;
    if (keysPressedRef.current["a"] || keysPressedRef.current["arrowleft"]) {
      steeringWheelAngleRef.current = Math.max(-360, steeringWheelAngleRef.current - steerSpeed);
      steeringAngleRef.current = (steeringWheelAngleRef.current / 360) * 35;
      isSteering = true;
    } else if (keysPressedRef.current["d"] || keysPressedRef.current["arrowright"]) {
      steeringWheelAngleRef.current = Math.min(360, steeringWheelAngleRef.current + steerSpeed);
      steeringAngleRef.current = (steeringWheelAngleRef.current / 360) * 35;
      isSteering = true;
    }

    if (!isSteering && !isDraggingWheelRef.current) {
      const centerSpeed = 320 * dt;
      if (Math.abs(steeringWheelAngleRef.current) < centerSpeed) {
        steeringWheelAngleRef.current = 0;
      } else {
        steeringWheelAngleRef.current -= Math.sign(steeringWheelAngleRef.current) * centerSpeed;
      }
      steeringAngleRef.current = (steeringWheelAngleRef.current / 360) * 35;
    }

    // 2. Pedals inputs state
    const isGas = keysPressedRef.current["w"] || keysPressedRef.current["arrowup"] || mouseGasPressedRef.current;
    const isBrake = keysPressedRef.current["s"] || keysPressedRef.current["arrowdown"] || keysPressedRef.current[" "] || mouseBrakePressedRef.current;

    setPedalGas(isGas);
    setPedalBrake(isBrake);

    // 3. Proximity warnings
    const proxWarning = checkProximity(carXRef.current, carYRef.current);
    if (proxWarning !== isNearObstacleRef.current) {
      isNearObstacleRef.current = proxWarning;
      setIsNearObstacle(proxWarning);
    }

    // 4. Kinematics updates
    const activeGear = gearRef.current;
    let currentSpeed = speedRef.current;

    // Passive rolling friction
    currentSpeed *= Math.max(0, 1 - 1.2 * dt);

    const acceleration = 95;
    const brakeForce = 240;
    const maxForwardSpeed = 80;
    const maxReverseSpeed = -35;

    if (activeGear === "D") {
      if (isGas) {
        currentSpeed += acceleration * dt;
        if (currentSpeed > maxForwardSpeed) currentSpeed = maxForwardSpeed;
      }
      if (isBrake) {
        currentSpeed -= brakeForce * dt;
        if (currentSpeed < 0) currentSpeed = 0;
      }
    } else if (activeGear === "R") {
      if (isGas) {
        currentSpeed -= acceleration * dt;
        if (currentSpeed < maxReverseSpeed) currentSpeed = maxReverseSpeed;
      }
      if (isBrake) {
        currentSpeed += brakeForce * dt;
        if (currentSpeed > 0) currentSpeed = 0;
      }
    } else if (activeGear === "N") {
      if (isBrake) {
        currentSpeed -= Math.sign(currentSpeed) * brakeForce * dt;
        if (Math.abs(currentSpeed) < 2) currentSpeed = 0;
      }
    } else if (activeGear === "P") {
      currentSpeed = 0;
    }

    speedRef.current = currentSpeed;

    const wheelbaseL = 30;
    const steerRad = (steeringAngleRef.current * Math.PI) / 180;
    const dTheta = (currentSpeed / wheelbaseL) * Math.tan(steerRad) * dt;
    angleDegRef.current += dTheta * (180 / Math.PI);

    while (angleDegRef.current < -180) angleDegRef.current += 360;
    while (angleDegRef.current > 180) angleDegRef.current -= 360;

    const rad = (angleDegRef.current * Math.PI) / 180;
    carXRef.current += currentSpeed * Math.cos(rad) * dt;
    carYRef.current += currentSpeed * Math.sin(rad) * dt;

    // 5. Collision & goal success verifications
    const collided = checkCollisions(carXRef.current, carYRef.current, angleDegRef.current);
    if (collided) {
      gameStatusRef.current = "crashed";
      setGameStatus("crashed");
      speedRef.current = 0;
      setIsNearObstacle(false);
      isNearObstacleRef.current = false;
    } else {
      const success = checkSuccess(carXRef.current, carYRef.current, angleDegRef.current, currentSpeed, activeGear);
      if (success) {
        gameStatusRef.current = "success";
        setGameStatus("success");
        speedRef.current = 0;
        setIsNearObstacle(false);
        isNearObstacleRef.current = false;
      }
    }

    setSimState({
      carX: carXRef.current,
      carY: carYRef.current,
      angleDeg: angleDegRef.current,
      speed: speedRef.current,
      steeringAngle: steeringAngleRef.current,
      gear: activeGear,
      gameStatus: gameStatusRef.current,
    });

    if (gameStatusRef.current === "playing") {
      stateRef.current.raf = requestAnimationFrame(interactiveLoop);
    }
  };

  // Handle keyboard event registrations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysPressedRef.current[k] = true;
      
      if (driveMode === "interactive" && gameStatusRef.current === "playing") {
        if (k === "p") handleGearChange("P");
        if (k === "r") handleGearChange("R");
        if (k === "n") handleGearChange("N");
        if (k === "d") handleGearChange("D");
        
        if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) {
          e.preventDefault();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysPressedRef.current[k] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [driveMode]);

  // Clean and reset on scenario/mode switches
  useEffect(() => {
    resetSimulation();
  }, [testType, driveMode]);

  // Cancel loops on component unmount
  useEffect(() => {
    return () => {
      if (stateRef.current.raf) {
        cancelAnimationFrame(stateRef.current.raf);
      }
    };
  }, []);

  // Mouse drag logic for steering wheel
  const handleWheelMouseDown = (e: React.MouseEvent<SVGGElement>) => {
    e.preventDefault();
    if (gameStatus !== "playing") return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const startAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
    const initialWheelAngle = steeringWheelAngleRef.current;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const angle = Math.atan2(moveEvent.clientY - cy, moveEvent.clientX - cx);
      let diffRad = angle - startAngle;
      while (diffRad < -Math.PI) diffRad += Math.PI * 2;
      while (diffRad > Math.PI) diffRad -= Math.PI * 2;
      
      const diffDeg = diffRad * (180 / Math.PI);
      let newWheelAngle = initialWheelAngle + diffDeg;
      newWheelAngle = Math.max(-360, Math.min(360, newWheelAngle));
      steeringWheelAngleRef.current = newWheelAngle;
      steeringAngleRef.current = (newWheelAngle / 360) * 35;
    };
    
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      isDraggingWheelRef.current = false;
    };
    
    isDraggingWheelRef.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Touch drag logic for steering wheel on mobile
  const handleWheelTouchStart = (e: React.TouchEvent<SVGGElement>) => {
    if (e.touches.length === 0 || gameStatus !== "playing") return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const startAngle = Math.atan2(touch.clientY - cy, touch.clientX - cx);
    const initialWheelAngle = steeringWheelAngleRef.current;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length === 0) return;
      const t = moveEvent.touches[0];
      const angle = Math.atan2(t.clientY - cy, t.clientX - cx);
      let diffRad = angle - startAngle;
      while (diffRad < -Math.PI) diffRad += Math.PI * 2;
      while (diffRad > Math.PI) diffRad -= Math.PI * 2;
      
      const diffDeg = diffRad * (180 / Math.PI);
      let newWheelAngle = initialWheelAngle + diffDeg;
      newWheelAngle = Math.max(-360, Math.min(360, newWheelAngle));
      steeringWheelAngleRef.current = newWheelAngle;
      steeringAngleRef.current = (newWheelAngle / 360) * 35;
    };
    
    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      isDraggingWheelRef.current = false;
    };
    
    isDraggingWheelRef.current = true;
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Mouse press logic for Gas Pedal
  const handleGasMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== "playing") return;
    mouseGasPressedRef.current = true;
    setPedalGas(true);
    
    const handleGasMouseUp = () => {
      mouseGasPressedRef.current = false;
      setPedalGas(false);
      window.removeEventListener("mouseup", handleGasMouseUp);
    };
    window.addEventListener("mouseup", handleGasMouseUp);
  };

  const handleGasTouchStart = (e: React.TouchEvent) => {
    if (gameStatus !== "playing") return;
    mouseGasPressedRef.current = true;
    setPedalGas(true);
    
    const handleGasTouchEnd = () => {
      mouseGasPressedRef.current = false;
      setPedalGas(false);
      window.removeEventListener("touchend", handleGasTouchEnd);
    };
    window.addEventListener("touchend", handleGasTouchEnd);
  };

  // Mouse press logic for Brake Pedal
  const handleBrakeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== "playing") return;
    mouseBrakePressedRef.current = true;
    setPedalBrake(true);
    
    const handleBrakeMouseUp = () => {
      mouseBrakePressedRef.current = false;
      setPedalBrake(false);
      window.removeEventListener("mouseup", handleBrakeMouseUp);
    };
    window.addEventListener("mouseup", handleBrakeMouseUp);
  };

  const handleBrakeTouchStart = (e: React.TouchEvent) => {
    if (gameStatus !== "playing") return;
    mouseBrakePressedRef.current = true;
    setPedalBrake(true);
    
    const handleBrakeTouchEnd = () => {
      mouseBrakePressedRef.current = false;
      setPedalBrake(false);
      window.removeEventListener("touchend", handleBrakeTouchEnd);
    };
    window.addEventListener("touchend", handleBrakeTouchEnd);
  };

  // Drag logic for Shifter Knob
  const handleShifterMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus !== "playing") return;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const svgElement = document.getElementById("city-drive-svg");
      if (!svgElement) return;
      const rect = svgElement.getBoundingClientRect();
      const relativeY = ((moveEvent.clientY - rect.top) / rect.height) * 200;
      
      let closestGear: "P" | "R" | "N" | "D" = "P";
      let minDist = 99999;
      const positions = { P: 60, R: 86, N: 113, D: 140 };
      for (const [g, posY] of Object.entries(positions)) {
        const dist = Math.abs(relativeY - posY);
        if (dist < minDist) {
          minDist = dist;
          closestGear = g as "P" | "R" | "N" | "D";
        }
      }
      if (gearRef.current !== closestGear) {
        handleGearChange(closestGear);
      }
    };
    
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleShifterTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0 || gameStatus !== "playing") return;
    e.preventDefault();
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length === 0) return;
      const touch = moveEvent.touches[0];
      const svgElement = document.getElementById("city-drive-svg");
      if (!svgElement) return;
      const rect = svgElement.getBoundingClientRect();
      const relativeY = ((touch.clientY - rect.top) / rect.height) * 200;
      
      let closestGear: "P" | "R" | "N" | "D" = "P";
      let minDist = 99999;
      const positions = { P: 60, R: 86, N: 113, D: 140 };
      for (const [g, posY] of Object.entries(positions)) {
        const dist = Math.abs(relativeY - posY);
        if (dist < minDist) {
          minDist = dist;
          closestGear = g as "P" | "R" | "N" | "D";
        }
      }
      if (gearRef.current !== closestGear) {
        handleGearChange(closestGear);
      }
    };
    
    const handleTouchEnd = () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
  };

  const aiExplanation = () => {
    if (!v || !m) return null;
    let interpretation = "";
    let buyingAdvice = "";

    interpretation = `With a turning radius of ${turningRadius.toFixed(2)}m and a ${trans} transmission, the variant scores ${cityScore.toFixed(1)}/10 for city friendliness.`;
    
    if (isAuto) {
      buyingAdvice = `The automatic gearbox completely removes clutch fatigue during gridlocks. Combined with a compact footprint, this is ideal for daily bumper-to-bumper office crawls.`;
    } else {
      buyingAdvice = `Manual transmissions are tedious in high-density crawls. Also, a turning radius above 5.3m means you will occasionally need to do 3-point turns instead of a single sweeping U-turn on narrow city flyover loops.`;
    }

    return {
      interpretation,
      buyingAdvice,
    };
  };

  const explain = aiExplanation();

  return (
    <div className="glass p-6 rounded-[32px] overflow-hidden">
      
      {/* ── CONTEXT CONFIGURATOR ── */}
      <div className="grid gap-4 md:grid-cols-4 items-end mb-6">
        <VariantSelect
          label="Your Vehicle"
          value={id}
          onChange={(x) => {
            setId(x);
            if (typeof window !== "undefined") {
              localStorage.setItem("drivescope_selected_variant", x);
            }
          }}
        />
        
        <label className="block text-sm">
          <span className="text-secondary text-xs block mb-1">Maneuver Select</span>
          <select
            value={testType}
            onChange={(e) => {
              setTestType(e.target.value as any);
            }}
            className="block w-full px-3 py-2 text-primary text-sm outline-none border border-black/10 rounded-xl"
          >
            <option value="uturn">Tight U-Turn Circle</option>
            <option value="parking">Parallel Parking Challenge</option>
          </select>
        </label>

        {/* ── DRIVE MODE TOGGLE ── */}
        <label className="block text-sm">
          <span className="text-secondary text-xs block mb-1">Driving Mode</span>
          <div className="flex bg-[#F0ECE3] p-0.5 rounded-xl border border-black/5">
            <button
              onClick={() => setDriveMode("auto")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                driveMode === "auto"
                  ? "bg-white text-primary shadow-sm"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Auto-Simulate
            </button>
            <button
              onClick={() => setDriveMode("interactive")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                driveMode === "interactive"
                  ? "bg-white text-primary shadow-sm"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Interactive Drive
            </button>
          </div>
        </label>

        {driveMode === "auto" ? (
          <button
            onClick={runAutoSimulation}
            disabled={gameStatus === "playing"}
            className="px-6 py-2.5 bg-accent text-white font-bold text-sm rounded-xl hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center gap-2"
          >
            {gameStatus === "playing" ? (
              <>
                <Compass className="w-4 h-4 animate-spin text-white" />
                Testing...
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-white" />
                RUN MANEUVER TEST
              </>
            )}
          </button>
        ) : (
          <button
            onClick={startInteractiveDriving}
            className="px-6 py-2.5 bg-accent text-white font-bold text-sm rounded-xl hover:scale-[1.02] transition-transform duration-200 flex items-center justify-center gap-2"
          >
            <Gamepad2 className="w-4 h-4 text-white" />
            {gameStatus === "playing" ? "RESTART DRIVE" : "START DRIVING"}
          </button>
        )}
      </div>

      {/* ── SIMULATION VIEWPORT ── */}
      <div className="relative w-full aspect-[22/8] bg-[#0A0710] rounded-2xl overflow-hidden border border-white/[0.08]">
        {/* Sky / Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0c1f] to-[#0A0710] opacity-90" />
        
        {/* ── INTERACTIVE GAME OVERLAYS ── */}
        {driveMode === "interactive" && (
          <>
            {/* Start engine overlay */}
            {gameStatus === "idle" && (
              <div className="absolute inset-y-0 left-[120px] right-[120px] bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center text-center p-4 z-10">
                <Gamepad2 className="w-8 h-8 text-[#C84C31] mb-2 animate-bounce" />
                <h3 className="text-white text-xs font-bold uppercase tracking-wider font-mono">
                  Interactive Drive Mode
                </h3>
                <p className="text-[10px] text-[#9CA3AF] max-w-xs mt-1 leading-relaxed">
                  Steer using <span className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">W/A/S/D</span> or <span className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">Arrows</span>. Shift gears using P/R/N/D. Don't hit curbs or cars!
                </p>
                <button
                  onClick={startInteractiveDriving}
                  className="mt-4 px-5 py-2 bg-[#C84C31] hover:bg-[#C84C31]/80 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-colors"
                >
                  Start Driving
                </button>
              </div>
            )}

            {/* Crash screen overlay */}
            {gameStatus === "crashed" && (
              <div className="absolute inset-y-0 left-[120px] right-[120px] bg-[#C84C31]/20 backdrop-blur-sm flex flex-col justify-center items-center text-center p-4 z-10 border-x border-[#C84C31]/30">
                <AlertTriangle className="w-9 h-9 text-[#C84C31] mb-2 animate-pulse" />
                <h3 className="text-white text-xs font-bold uppercase tracking-wider font-mono">
                  COLLISION DETECTED
                </h3>
                <p className="text-[10px] text-[#ECE7DF] max-w-xs mt-1 leading-relaxed">
                  You hit an obstacle! Keep an eye on the radar arcs and steer carefully.
                </p>
                <button
                  onClick={startInteractiveDriving}
                  className="mt-4 px-5 py-2 bg-[#C84C31] hover:bg-[#C84C31]/80 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Again
                </button>
              </div>
            )}

            {/* Success screen overlay */}
            {gameStatus === "success" && (
              <div className="absolute inset-y-0 left-[120px] right-[120px] bg-green-950/45 backdrop-blur-sm flex flex-col justify-center items-center text-center p-4 z-10 border-x border-green-800/30">
                <CheckCircle2 className="w-9 h-9 text-green-500 mb-2 animate-bounce" />
                <h3 className="text-white text-xs font-bold uppercase tracking-wider font-mono">
                  {testType === "uturn" ? "U-TURN COMPLETED" : "PERFECTLY PARKED"}
                </h3>
                <p className="text-[10px] text-[#ECE7DF] max-w-xs mt-1 leading-relaxed">
                  {testType === "uturn"
                    ? "Excellent vehicle control and steering execution around the tight loop!"
                    : "Perfect parallel parking! Correct alignment and shifted into Park."}
                </p>
                <button
                  onClick={startInteractiveDriving}
                  className="mt-4 px-5 py-2 bg-green-700 hover:bg-green-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Play Again
                </button>
              </div>
            )}
          </>
        )}

        <svg id="city-drive-svg" viewBox="0 0 700 200" className="absolute inset-0 w-full h-full select-none">
          {/* Grid lines */}
          <g opacity={0.08} stroke="#4F6B8A" strokeWidth={0.5}>
            <line x1="100" y1="0" x2="100" y2="200" />
            <line x1="200" y1="0" x2="200" y2="200" />
            <line x1="300" y1="0" x2="300" y2="200" />
            <line x1="400" y1="0" x2="400" y2="200" />
            <line x1="500" y1="0" x2="500" y2="200" />
            <line x1="600" y1="0" x2="600" y2="200" />
          </g>

          {/* ── U-Turn specific lanes ── */}
          {testType === "uturn" && (
            <g>
              {/* Outer boundary wall */}
              <path d="M 50,190 H 650" fill="none" stroke="rgba(79, 107, 138, 0.2)" strokeWidth={4} />
              
              {/* Median Divider (center grass island) */}
              <rect x="250" y="90" width="200" height="20" rx="4" fill="rgba(79, 107, 138, 0.15)" stroke="rgba(79, 107, 138, 0.3)" strokeWidth={1} />
              <text fill="#9CA3AF" fontSize={7} fontFamily="monospace" x="315" y="102">MEDIAN ISLAND</text>

              {/* Semicircular turning circle guide path */}
              <path
                d={`M ${350 - turningRadius*12},150 A ${turningRadius*12} ${turningRadius*12} 0 0,1 ${350 + turningRadius*12},150`}
                fill="none"
                stroke="#4F6B8A"
                strokeWidth={1.2}
                strokeDasharray="4 4"
                opacity={0.35}
              />
            </g>
          )}

          {/* ── Parking specific slots ── */}
          {testType === "parking" && (
            <g>
              {/* Kerb line */}
              <line x1="50" y1="150" x2="650" y2="150" stroke="rgba(79, 107, 138, 0.4)" strokeWidth={1.5} />
              
              {/* Parked vehicles (front and rear boundaries) */}
              {/* Front car */}
              <rect x="240" y="115" width="80" height="30" rx="3" fill="rgba(79,107,138,0.15)" stroke="rgba(79,107,138,0.3)" />
              <text fill="#9CA3AF" fontSize={7} fontFamily="monospace" x="250" y="132">PARKED SEDAN</text>

              {/* Rear car */}
              <rect x="440" y="115" width="80" height="30" rx="3" fill="rgba(79,107,138,0.15)" stroke="rgba(79,107,138,0.3)" />
              <text fill="#9CA3AF" fontSize={7} fontFamily="monospace" x="450" y="132">PARKED SUV</text>

              {/* The Target Slot */}
              <rect x="330" y="116" width="100" height="28" fill="none" stroke="#4F6B8A" strokeWidth={1} strokeDasharray="3 3" opacity={0.3} />
              <text fill="#4F6B8A" fontSize={6.5} fontFamily="monospace" x="352" y="132" opacity={0.5}>VACANT SLOT</text>
            </g>
          )}

          {/* ── Car Silhouette (Updates dynamically from state/physics) ── */}
          <g transform={`translate(${simState.carX}, ${simState.carY}) rotate(${simState.angleDeg})`}>
            {/* Visualizing A-pillar blind spot cones */}
            <path d="M 20,0 L 80,-30 L 80,-15 Z" fill="rgba(200, 76, 49, 0.08)" stroke="none" />
            <path d="M 20,0 L 80,30 L 80,15 Z" fill="rgba(200, 76, 49, 0.08)" stroke="none" />
            
            {/* Forward visibility cone */}
            <path d="M 20,0 L 110,-45 L 110,45 Z" fill="rgba(79, 107, 138, 0.06)" stroke="none" />

            {/* Radar warning circles when close to obstacle */}
            {isNearObstacle && driveMode === "interactive" && (
              <g stroke="#C84C31" strokeWidth="1.2" fill="none" opacity="0.8">
                {/* Front arcs */}
                <path d="M 28,-14 A 20 20 0 0 1 28,14" className="animate-pulse" />
                <path d="M 33,-18 A 25 25 0 0 1 33,18" className="animate-pulse opacity-60" />
                {/* Rear arcs */}
                <path d="M -28,-14 A 20 20 0 0 0 -28,14" className="animate-pulse" />
                <path d="M -33,-18 A 25 25 0 0 0 -33,18" className="animate-pulse opacity-60" />
              </g>
            )}

            <TopDownCarSprite
              modelId={m?.id ?? TOP_DOWN_REF.modelId}
              color={carColor}
              dna={vehicleDna}
              lengthMm={lengthMm}
              widthMm={widthMm}
            />
          </g>

          {/* ── COCKPIT DASHBOARD OVERLAYS ── */}
          {driveMode === "interactive" && (
            <>
              {/* Left Dashboard Panel (Steering & Pedals) */}
              <g>
                <rect x="0" y="0" width="120" height="200" fill="rgba(10, 7, 16, 0.88)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
                <line x1="120" y1="0" x2="120" y2="200" stroke="#4F6B8A" strokeWidth="1.5" opacity="0.3" />

                {/* Rotating Steering Wheel Group */}
                <g
                  transform={`translate(60, 75) rotate(${steeringWheelAngleRef.current})`}
                  className="cursor-grab active:cursor-grabbing select-none"
                  onMouseDown={handleWheelMouseDown}
                  onTouchStart={handleWheelTouchStart}
                >
                  {/* Invisible easy-to-grab overlay */}
                  <circle cx="0" cy="0" r="42" fill="transparent" />

                  {/* Outer Rim */}
                  <circle cx="0" cy="0" r="32" fill="none" stroke="#C84C31" strokeWidth="5.5" />
                  <circle cx="0" cy="0" r="28" fill="none" stroke="#161616" strokeWidth="0.8" opacity="0.4" />
                  
                  {/* Spokes */}
                  <line x1="-32" y1="0" x2="32" y2="0" stroke="#4F6B8A" strokeWidth="3" />
                  <line x1="0" y1="0" x2="0" y2="32" stroke="#4F6B8A" strokeWidth="3" />

                  {/* Center Hub */}
                  <circle cx="0" cy="0" r="8" fill="#14121A" stroke="#4F6B8A" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="3" fill="#C84C31" />

                  {/* Alignment Stripe */}
                  <rect x="-1.5" y="-32" width="3" height="6" fill="#FFFFFF" rx="0.5" />
                </g>
                <text x="60" y="132" fill="#9CA3AF" fontSize="6.5" textAnchor="middle" fontFamily="monospace">STEER WHEEL</text>

                {/* Pedals at the bottom */}
                {/* Brake Pedal */}
                <rect
                  x="18"
                  y="150"
                  width="30"
                  height="34"
                  rx="4"
                  fill={pedalBrake ? "#C84C31" : "#191620"}
                  stroke="#4F6B8A"
                  strokeWidth="1"
                  className="cursor-pointer select-none transition-colors duration-75"
                  onMouseDown={handleBrakeMouseDown}
                  onTouchStart={handleBrakeTouchStart}
                />
                <text x="33" y="171" fill={pedalBrake ? "#FFFFFF" : "rgba(255, 255, 255, 0.45)"} fontSize="7" fontWeight="bold" textAnchor="middle" pointerEvents="none">BRAKE</text>

                {/* Gas Pedal */}
                <rect
                  x="70"
                  y="145"
                  width="22"
                  height="39"
                  rx="4"
                  fill={pedalGas ? "#C84C31" : "#191620"}
                  stroke="#4F6B8A"
                  strokeWidth="1"
                  className="cursor-pointer select-none transition-colors duration-75"
                  onMouseDown={handleGasMouseDown}
                  onTouchStart={handleGasTouchStart}
                />
                <text x="81" y="169" fill={pedalGas ? "#FFFFFF" : "rgba(255, 255, 255, 0.45)"} fontSize="7" fontWeight="bold" textAnchor="middle" pointerEvents="none" transform="rotate(-90 81 169)">GAS</text>
              </g>

              {/* Right Dashboard Panel (Gear Shifter & Speed) */}
              <g>
                <rect x="580" y="0" width="120" height="200" fill="rgba(10, 7, 16, 0.88)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
                <line x1="580" y1="0" x2="580" y2="200" stroke="#4F6B8A" strokeWidth="1.5" opacity="0.3" />

                {/* Speed readout */}
                <rect x="590" y="10" width="100" height="35" rx="6" fill="#14121A" stroke="rgba(255, 255, 255, 0.08)" />
                <text x="640" y="21" fill="#9CA3AF" fontSize="6" textAnchor="middle" fontFamily="monospace">SPEEDOMETER</text>
                <text x="640" y="39" fill="#C84C31" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {Math.round(Math.abs(simState.speed * 0.72))} <tspan fontSize="7" fontWeight="normal" fill="#9CA3AF">km/h</tspan>
                </text>

                {/* Shifter Slider Track */}
                <rect x="640" y="55" width="8" height="90" rx="4" fill="#14121A" stroke="rgba(255,255,255,0.08)" />
                
                {/* Selector Letters */}
                <g fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle" fill="#9CA3AF">
                  <text x="618" y="64" fill={simState.gear === "P" ? "#C84C31" : "#9CA3AF"} className="cursor-pointer select-none" onClick={() => handleGearChange("P")}>P</text>
                  <text x="618" y="90" fill={simState.gear === "R" ? "#C84C31" : "#9CA3AF"} className="cursor-pointer select-none" onClick={() => handleGearChange("R")}>R</text>
                  <text x="618" y="117" fill={simState.gear === "N" ? "#C84C31" : "#9CA3AF"} className="cursor-pointer select-none" onClick={() => handleGearChange("N")}>N</text>
                  <text x="618" y="144" fill={simState.gear === "D" ? "#C84C31" : "#9CA3AF"} className="cursor-pointer select-none" onClick={() => handleGearChange("D")}>D</text>
                </g>

                {/* Shifter Lever Knob */}
                <circle
                  cx="644"
                  cy={gearPositions[simState.gear]}
                  r="9"
                  fill="#C84C31"
                  stroke="#161616"
                  strokeWidth="2"
                  className="cursor-pointer active:scale-95"
                  onMouseDown={handleShifterMouseDown}
                  onTouchStart={handleShifterTouchStart}
                />
                <circle cx="644" cy={gearPositions[simState.gear]} r="4" fill="#FFFFFF" opacity="0.3" pointerEvents="none" />

                {/* Hotkeys controls help */}
                <text x="640" y="170" fill="#9CA3AF" fontSize="6.5" textAnchor="middle" opacity="0.5">Keys: W/A/S/D</text>
                <text x="640" y="180" fill="#9CA3AF" fontSize="6.5" textAnchor="middle" opacity="0.5">Gear: P/R/N/D</text>
              </g>
            </>
          )}
        </svg>

        {/* ── CITY MANEUVER SCORE WATERMARK ── */}
        <div className="absolute top-4 right-4 bg-black/60 px-4 py-3 rounded-2xl border border-white/[0.08] backdrop-blur-sm pointer-events-none text-right">
          <span className="text-[8.5px] font-mono text-[#9CA3AF] block uppercase">City Friendliness</span>
          <span className="text-3xl font-extrabold font-mono text-[#C84C31] block">
            {cityScore.toFixed(1)}<span className="text-xs text-[#9CA3AF] font-normal">/10</span>
          </span>
        </div>
      </div>

      {/* ── STATS & AI INSIGHTS ── */}
      {(gameStatus === "completed" || gameStatus === "success") && explain && (
        <div className="grid md:grid-cols-12 gap-6 mt-6 animate-fade-in">
          {/* Numerical readout (col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-[#120E18] p-5 rounded-2xl border border-white/[0.08] space-y-4">
              <h4 className="text-xs font-semibold tracking-tight text-[#C84C31] uppercase font-mono">
                MANEUVERABILITY SPEC
              </h4>
              
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#9CA3AF] block">TURNING RADIUS</span>
                  <span className="text-sm font-bold text-white">{turningRadius.toFixed(2)} meters</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block">WHEELBASE</span>
                  <span className="text-sm font-bold text-white">{wheelbaseMm} mm</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block">GEARBOX EASE</span>
                  <span className="text-sm font-bold text-white">{trans} ({isAuto ? "Auto" : "Manual"})</span>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block">CITY RATING</span>
                  <span className="text-sm font-bold text-[#C84C31]">{cityScore.toFixed(1)} / 10</span>
                </div>
              </div>
            </div>

            <button
              onClick={driveMode === "auto" ? runAutoSimulation : startInteractiveDriving}
              className="w-full py-3 bg-white/[0.08] hover:bg-white/[0.12] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Re-run Maneuver
            </button>
          </div>

          {/* AI Explanation Box (col-span-7) */}
          <div className="md:col-span-7 glass border border-[var(--accent)]/30 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-2xl rounded-full" />
            <div>
              <span className="text-[9px] font-mono tracking-widest text-[var(--accent)] uppercase">AI URBAN MANEUVER INSIGHT</span>
              <h4 className="text-base font-semibold mt-1 mb-3 text-primary">How this handles in tight city spaces</h4>
              
              <p className="text-xs text-secondary leading-relaxed mb-3">
                <span className="text-[var(--accent)] font-semibold">INTERPRETATION: </span>
                {explain.interpretation}
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                <span className="text-[var(--accent)] font-semibold">BUYING IMPACT: </span>
                {explain.buyingAdvice}
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/[0.08] flex justify-between items-center text-[10px] text-[#9CA3AF]">
              <span>VISIBILITY & STEERING GEOMETRIES</span>
              <span>DRIVESCOPE LABS</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
