export function Name() { return "Robobloq_SignalRGB"; }
export function VendorId() { return 0x1a86; }
export function ProductId() { return 0xfe07; }
export function Publisher() { return "Clay"; }
export function Documentation(){ return "troubleshooting/brand"; }
export function Size() { return [42, 16]; }

export function ControllableParameters() {
    return [
        { "property": "shutdownColor", "group": "lighting", "label": "Shutdown Color", "min": "0", "max": "360", "type": "color", "default": "009bde" },
        { "property": "LightingMode", "group": "lighting", "label": "Lighting Mode", "type": "combobox", "values": ["Canvas", "Forced"], "default": "Canvas" },
        { "property": "forcedColor", "group": "lighting", "label": "Forced Color", "min": "0", "max": "360", "type": "color", "default": "009bde" },
    ];
}

export function Initialize() {
    initpacket1(device);
}

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
    sendColors(true); // envia cor de desligamento
}

export function Validate(endpoint) {
    console.log("validating endpoint", endpoint);
    return true;
}

export function ImageUrl() {
    return "";
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) { return [0, 0, 0]; }
    let colors = [];
    colors[0] = parseInt(result[1], 16);
    colors[1] = parseInt(result[2], 16);
    colors[2] = parseInt(result[3], 16);
    return colors;
}

let packetSequence = 0x00; // contador global de pacotes

function sendColors(shutdown = false) {
    let lightingMode = device.properties.LightingMode;
    let forcedColor = device.properties.forcedColor;
    let shutdownColor = device.properties.shutdownColor;

    let packet = new Array(65).fill(0x00);
    packet[0] = 0x00;

    packet[1] = 0x52;
    packet[2] = 0x42;
    packet[3] = 0x10;
    packet[4] = packetSequence;
    packetSequence = (packetSequence + 1) & 0xFF;
    packet[5] = 0x86;
    packet[6] = 0x01;

    let color;
    if (shutdown) {
        color = hexToRgb(shutdownColor);
    } else if (lightingMode === "Forced") {
        color = hexToRgb(forcedColor);
    } else {
        if (vLedPositions.length > 0) {
            color = device.color(...vLedPositions[0]);
        } else {
            color = [0, 0, 0];
        }
    }

    packet[7] = color[0];
    packet[8] = color[1];
    packet[9] = color[2];

    // --- AQUI É O PONTO CRÍTICO AGORA ---
    // Você precisa preencher os bytes restantes do pacote (do índice 10 até 64)
    // com os valores EXATOS que você viu no Wireshark para os pacotes de cor.
    // EXEMPLO (você precisa ajustar com seus dados reais do Wireshark!):
    packet[10] = 0x47; // Exemplo de um byte fixo do Wireshark
    packet[11] = 0x48; // Exemplo de outro byte fixo
    packet[12] = 0x00; // E assim por diante, preencha TODOS os 64 bytes do payload
    packet[13] = 0x00; // Isso é o que vem DEPOIS do RGB
    packet[14] = 0x00;
    packet[15] = 0xFE;
    packet[16] = 0xBC; // Se o Wireshark mostrou 0xBC para R e 0xBD para G/B, use o correto
    // ... continue preenchendo até packet[64]
    // A maioria dos bytes restantes provavelmente são 0x00, mas confirme no Wireshark.
    // Se eles são fixos, preencha-os manualmente.

    device.write(packet, 65);
}

function initpacket1(device) {
    let packet = new Array(65).fill(0x00);
    packet[0] = 0x00;

    packet[1] = 0x52;
    packet[2] = 0x42;
    packet[3] = 0x10;
    packet[4] = packetSequence;
    packetSequence = (packetSequence + 1) & 0xFF;
    packet[5] = 0x86;
    packet[6] = 0x01;

    // Se o seu pacote de inicialização no Wireshark tem bytes específicos depois do cabeçalho,
    // preencha-os aqui, assim como na função sendColors.
    // Exemplo (se for um pacote "vazio" ou de reset):
    // packet[7] = 0x00; // R
    // packet[8] = 0x00; // G
    // packet[9] = 0x00; // B
    // ... e os demais bytes fixos até packet[64]

    device.write(packet, 65);
}

// LED config gerada corretamente abaixo
var vLedNames = [];
var vLedPositions = [];

let idx = 1;
for (let y = 0; y < 15; y++) {
    vLedNames.push("Led " + idx);
    vLedPositions.push([0, y]);
    idx++;
}
for (let x = 0; x < 41; x++) {
    vLedNames.push("Led " + idx);
    vLedPositions.push([x, 15]);
    idx++;
}
for (let y = 14; y >= 0; y--) {
    vLedNames.push("Led " + idx);
    vLedPositions.push([41, y]);
    idx++;
}
