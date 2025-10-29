export default function onSphere(radius = 1, out = []) {
  var phi = Math.random() * Math.PI * 2
  var theta = Math.acos(Math.random() * 2 - 1)
  out[0] = radius * Math.sin(theta) * Math.cos(phi)
  out[1] = radius * Math.sin(theta) * Math.sin(phi)
  out[2] = radius * Math.cos(theta)
  return out
}
