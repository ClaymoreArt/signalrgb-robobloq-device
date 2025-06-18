export function Name() { return "Robobloq_SignalRGB"; }
export function VendorId() { return 0x1a86; }
export function ProductId() { return 0xfe07; }
export function Publisher() { return "Clay"; }
export function Documentation(){ return "troubleshooting/brand"; }
export function Size() { return [42, 16]; }



export function ControllableParameters() {	
  return [
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
	];
}

export function Initialize() {

}

var vLedNames = [ "Led 1" ]; 
var vLedPositions = [ [0,0] ];

export function LedNames() {

}

export function LedPositions() {

}

export function Render() {
  sendColors();

}

export function Shutdown() {

}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	let colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);

	return colors;
}

export function Validate(endpoint) {
	return endpoint.interface === 0 && endpoint.usage === 0 && endpoint.usage_page === 0;
}

export function ImageUrl() {
	return "";
}
function sendColors(shutdown = false) {
  let lightingMode = device.properties.LightingMode; // pega a propriedade do device
  let forcedColor = device.properties.forcedColor;
  let shutdownColor = device.properties.shutdownColor;
  
  let packet = [];
  // ... seu código de pacote ...

  for (let i = 0; i < vLedPositions.length; i++) {
    let base = i * 4 + 5;
    packet[base] = 0x01;

    let color;
    if (shutdown) {
      color = hexToRgb(shutdownColor);
    } else if (lightingMode === "Forced") {
      color = hexToRgb(forcedColor);
    } else {
      color = device.color(...vLedPositions[i]);
    }

    packet[base + 1] = color[0];
    packet[base + 2] = color[1];
    packet[base + 3] = color[2];
  }
}

var vLedNames = [];
var vLedPositions = [];

let idx = 1;

// Barra esquerda (vertical)
for (let y = 0; y < 15; y++) {
  vLedNames.push("Led " + idx);
  vLedPositions.push([0, y]);
  idx++;
}

// Barra central (horizontal)
for (let x = 0; x < 41; x++) {
  vLedNames.push("Led " + idx);
  vLedPositions.push([x, 15]);
  idx++;
}

// Barra direita (vertical invertida)
for (let y = 14; y >= 0; y--) {
  vLedNames.push("Led " + idx);
  vLedPositions.push([41, y]);
  idx++;
}

function initpacket1(device) {
  // Seu pacote, traduzido byte a byte, separado por vírgulas
  let packet = [
    0x52, 0x42, 0x10, 0x12, 0x86, 0x01, 0xff, 0x00,
    0x00, 0x47, 0x48, 0x00, 0x00, 0x00, 0xfe, 0xc9,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ];

  // Garantir que o pacote tenha 65 bytes (se precisar, adiciona zeros)
  while (packet.length < 65) packet.push(0x00);

  device.write(packet, 65);
}

export function Validate(endpoint) {
  // Testa os valores que aparecem no log
  return endpoint.interface === 0 && endpoint.usage === 0x0001 && endpoint.usage_page === 0xff00;
}
