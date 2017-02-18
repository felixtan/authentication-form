module.exports = {
  encodeURIComponentEnhanced,
}

// extend encodeURIComponent to encode "(" and ")"
function encodeURIComponentEnhanced(input) {
  return encodeURIComponent(input)
          .replace(/\(/g, '%28')
          .replace(/\)/g, '%29')
}
