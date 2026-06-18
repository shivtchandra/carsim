/** Top-level Firestore collection names for DriveScope catalog data. */
export const COLLECTIONS = {
  brands: "brands",
  models: "models",
  variants: "variants",
  features: "features",
  testData: "testData",
  ownerVoices: "ownerVoices",
  vehicleDna: "vehicleDna",
  understandingFeatures: "understandingFeatures",
  understandingSpecs: "understandingSpecs",
  costParams: "costParams",
  upgradeInsights: "upgradeInsights",
  imageSources: "imageSources",
  communityWallPosts: "communityWallPosts",
  meta: "meta",
} as const;
