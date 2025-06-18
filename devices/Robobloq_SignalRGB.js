export function Name() { return "Robobloq"; }
export function VendorId() { return Ox1a86; }
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

function sendColors(shutdown = false)
{
  let packet = [];

  // Header fixo baseado no que vc viu no Wireshark
  packet[0] = 0x00; // nao e zero-padded, entao esse byte e valido
  packet[1] = 0x52;
  packet[2] = 0x42;
  packet[3] = 0x10;
  packet[4] = 0x7A; // esse muda, mas pode fixar como 0x7A mesmo (tipo de comando)
  packet[5] = 0x86;
  packet[6] = 0x01;

  // A partir daqui comecam os dados RGB
  for (let i = 0; i < vLedPositions.length; i++) {
    let x = vLedPositions[i][0];
    let y = vLedPositions[i][1];
    let color;

    if (shutdown) {
      color = hexToRgb(shutdownColor);
    } else if (LightingMode === "Forced") {
      color = hexToRgb(forcedColor);
    } else {
      color = device.color(x, y);
    }

    // Cada LED ocupa 4 bytes a partir do offset 7:
    // 1 byte inutil (pode manter 0x00 como nos pacotes), seguido de R, G, B
    let offset = (i * 4) + 7;
    packet[offset + 0] = 0x00;
    packet[offset + 1] = color[0];
    packet[offset + 2] = color[1];
    packet[offset + 3] = color[2];
  }

  // Preenche o resto com zeros ate 64 bytes
  while (packet.length < 64) {
    packet.push(0x00);
  }

  device.write(packet, 64);
}
// Nomes dos LEDs
var vLedNames = [];
for (let i = 1; i <= 71; i++) {
  vLedNames.push(`Led ${i}`);
}

// Posicoes dos LEDs
var vLedPositions = [];

// Barra esquerda (vertical) - 15 LEDs
for (let y = 0; y < 15; y++) {
  vLedPositions.push([0, y]);
}

// Barra central (horizontal) - 41 LEDs
for (let x = 0; x < 41; x++) {
  vLedPositions.push([x, 15]);
}

// Barra direita (vertical) - 15 LEDs (de cima pra baixo)
for (let y = 0; y < 15; y++) {
  vLedPositions.push([41, 14 - y]);
}
