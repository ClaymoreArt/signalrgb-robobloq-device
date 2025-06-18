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
  initpacket1(device);
}


var vLedNames = [ "Led 1" ]; 
var vLedPositions = [ [0,0] ];

export function LedNames() {
  return vLedNames;
}
export function DeviceType() {
  return "Other";
}
export function LedPositions() {
  return vLedPositions;
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
  console.log("validating endpoint", endpoint);
  return true;
  //return endpoint.interface === 0 && endpoint.usage === 0x0001 && endpoint.usage_page === 0xff00;
}

export function ImageUrl() {
	return "";
}
function sendColors(shutdown = false) {
  let lightingMode = device.properties.LightingMode;
  let forcedColor = device.properties.forcedColor;
  let shutdownColor = device.properties.shutdownColor;

  let packet = [];

  // HEADER
  packet[0] = 0x52;
  packet[1] = 0x42;
  packet[2] = 0x10;
  packet[3] = 0x12;
  packet[4] = 0x86;
  packet[5] = 0x01;
  packet[6] = 0xff;
  packet[7] = 0x00;
  packet[8] = 0x00;
  packet[9] = 0x47;
  packet[10] = 0x48;
  packet[11] = 0x00;
  packet[12] = 0x00;
  packet[13] = 0x00;
  packet[14] = 0xfe;
  packet[15] = 0xc9;

  for (let i = 16; i < 65; i++) packet[i] = 0x00;

  for (let i = 0; i < vLedPositions.length; i++) {
let base = i * 3 + 16; // Começa do byte 16 pra frente

    let color;
    if (shutdown) color = hexToRgb(shutdownColor);
    else if (lightingMode === "Forced") color = hexToRgb(forcedColor);
    else color = device.color(...vLedPositions[i]);

    packet[base] = color[0];     // R
    packet[base + 1] = color[1]; // G
    packet[base + 2] = color[2]; // B

  }

  device.write(packet, 65);


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
   let packet = [];

  packet[0] = 0x52;
  packet[1] = 0x42;
  packet[2] = 0x10;
  packet[3] = 0x12;
  packet[4] = 0x86;
  packet[5] = 0x01;
  packet[6] = 0xff;
  packet[7] = 0x00;

  packet[8] = 0x00;
  packet[9] = 0x47;
  packet[10] = 0x48;
  packet[11] = 0x00;
  packet[12] = 0x00;
  packet[13] = 0x00;
  packet[14] = 0xfe;
  packet[15] = 0xc9;

  // Os próximos bytes (16 até 64) são todos zeros
  for(let i = 16; i < 65; i++) {
    packet[i] = 0x00;
  }

  device.write(packet, 65);
}


