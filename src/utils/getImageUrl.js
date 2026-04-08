const DEFAULT_CLOUDINARY_CLOUD_NAME = "djgz1kays";

export const getImageUrl = (imageValue, options = "") => {
  if (!imageValue) return "/images/no-image.png";

  if (Array.isArray(imageValue)) {
    return getImageUrl(imageValue[0], options);
  }

  const normalizedValue =
    typeof imageValue === "string"
      ? imageValue
      : imageValue.images_public_id ||
        imageValue.image_public_id ||
        imageValue.public_id ||
        imageValue.secure_url ||
        imageValue.url ||
        null;

  if (!normalizedValue) return "/images/no-image.png";

  // If it's already a full URL, return it (with options if provided)
  if (
    /^(https?:)?\/\//i.test(normalizedValue) ||
    normalizedValue.startsWith("/")
  ) {
    // If options are provided and it's a Cloudinary URL, add the options
    if (options && normalizedValue.includes("cloudinary.com")) {
      // Insert options before the public_id (before the file extension)
      const lastSlashIndex = normalizedValue.lastIndexOf("/");
      const beforePublicId = normalizedValue.substring(0, lastSlashIndex);
      const publicIdAndExtension = normalizedValue.substring(lastSlashIndex);
      return `${beforePublicId}/${options}${publicIdAndExtension}`;
    }

    // For Cloudinary URLs, ensure HEIC images are converted to JPEG for better browser support
    if (normalizedValue.includes("cloudinary.com") && normalizedValue.toLowerCase().endsWith('.heic')) {
      // Convert HEIC to JPEG by replacing the extension and adding format parameter
      const urlWithoutExtension = normalizedValue.substring(0, normalizedValue.lastIndexOf('.'));
      return `${urlWithoutExtension}.jpg`;
    }

    return normalizedValue;
  }

  // For Cloudinary public_ids, construct the URL with version
  // Cloudinary requires version numbers for proper image serving
  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
    import.meta.env.CLOUDINARY_CLOUD_NAME ||
    DEFAULT_CLOUDINARY_CLOUD_NAME;

  // Extract version and public_id if present in the value
  // Format: v123456789/public_id or just public_id
  const versionMatch = normalizedValue.match(/^v(\d+)\//);
  let version = "";
  let publicId = normalizedValue;

  if (versionMatch) {
    version = `v${versionMatch[1]}/`;
    publicId = normalizedValue.replace(versionMatch[0], "");
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${version}${options ? `${options}/` : ""}${publicId}`;
};