export default async function loadDesignFromJSON(path) {
  const res = await fetch(path)
  const data = await res.json()
  // Extract image path from JSON
  return data.textureImage || '/defaultTexture.png'
}
