export const meta = {
  slug: 'ip-subnet',
  name: 'IP Subnet Calculator',
  title: 'IP Subnet Calculator - Calcyx',
  description: 'Calculate network and broadcast addresses, usable IP ranges, wildcard masks, and host details for any IPv4 address and subnet.',
  category: 'everyday',
  icon: '🌐',
  keywords: ['ip address', 'subnet mask', 'cidr', 'network address', 'broadcast address', 'ip range', 'wildcard mask'],
  formula: 'Network = IP AND Mask, Broadcast = IP OR (NOT Mask)',
  relatedSlugs: ['base-converter', 'binary-text']
};

export function render() {
  const el = document.createElement('div');
  el.className = 'calc-page';

  el.innerHTML = `
    <div class="calc-card">
      <div class="calc-header">
        <span class="calc-icon">${meta.icon}</span>
        <h1 class="calc-title">${meta.name}</h1>
        <p class="calc-description">${meta.description}</p>
      </div>
      <div class="calc-body">
        <div class="calc-row">
          <div class="calc-input-group" style="flex: 2;">
            <label for="ip-address">IP Address</label>
            <input type="text" id="ip-address" class="calc-input" value="192.168.1.1" placeholder="e.g., 192.168.1.1">
          </div>
          <div class="calc-input-group" style="flex: 1;">
            <label for="cidr-suffix">CIDR Prefix</label>
            <select id="cidr-suffix" class="calc-select">
              ${Array.from({ length: 33 }, (_, i) => `<option value="${i}" ${i === 24 ? 'selected' : ''}>/${i}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="calc-input-group">
          <label for="subnet-mask">Subnet Mask</label>
          <select id="subnet-mask" class="calc-select">
            <!-- Populated via mount -->
          </select>
        </div>

        <div id="error-message" style="display: none; color: #ff6b6b; font-size: 0.9rem; margin-bottom: 1rem; font-family: monospace; background: rgba(255, 107, 107, 0.1); border-left: 3px solid #ff6b6b; padding: 0.5rem 0.75rem; border-radius: 4px;"></div>

        <div id="result" class="calc-result" style="display: none;">
          <div class="calc-result-value" id="cidr-notation-display" style="font-size: 1.8rem; margin-bottom: 1rem;"></div>
          
          <div class="calc-result-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
            <div class="calc-result-item">
              <div class="calc-result-label">Network Address</div>
              <div class="calc-result-value" id="net-address" style="font-size: 1.3rem;"></div>
              <div class="calc-result-detail" id="net-binary" style="font-family: monospace; font-size: 0.75rem;"></div>
            </div>
            
            <div class="calc-result-item">
              <div class="calc-result-label">Broadcast Address</div>
              <div class="calc-result-value" id="broadcast-address" style="font-size: 1.3rem;"></div>
              <div class="calc-result-detail" id="broadcast-binary" style="font-family: monospace; font-size: 0.75rem;"></div>
            </div>

            <div class="calc-result-item">
              <div class="calc-result-label">Usable Host Range</div>
              <div class="calc-result-value" id="usable-range" style="font-size: 1.2rem; white-space: nowrap;"></div>
              <div class="calc-result-detail">First to Last Usable IP</div>
            </div>

            <div class="calc-result-item">
              <div class="calc-result-label">Total Usable Hosts</div>
              <div class="calc-result-value" id="usable-hosts" style="font-size: 1.3rem;"></div>
              <div class="calc-result-detail" id="total-hosts-detail"></div>
            </div>

            <div class="calc-result-item">
              <div class="calc-result-label">Wildcard Mask</div>
              <div class="calc-result-value" id="wildcard-mask" style="font-size: 1.3rem;"></div>
              <div class="calc-result-detail" id="wildcard-binary" style="font-family: monospace; font-size: 0.75rem;"></div>
            </div>

            <div class="calc-result-item">
              <div class="calc-result-label">IP Class</div>
              <div class="calc-result-value" id="ip-class" style="font-size: 1.3rem;"></div>
              <div class="calc-result-detail" id="ip-binary" style="font-family: monospace; font-size: 0.75rem;"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="calc-formula">
        <h3>📚 Understanding IP Subnetting</h3>
        <p>Subnetting splits a single physical network into multiple logical sub-networks (subnets). An IP address consists of two parts: a <strong>Network ID</strong> and a <strong>Host ID</strong>.</p>
        <ul>
          <li><strong>Subnet Mask:</strong> Defines which bits of the IP address belong to the network (represented by 1s) and which belong to the host (represented by 0s).</li>
          <li><strong>Network Address:</strong> Calculated by performing a bitwise logical <code>AND</code> operation between the IP address and the Subnet Mask. This is the first IP in the subnet and identifies the network itself.</li>
          <li><strong>Broadcast Address:</strong> Calculated by performing a bitwise logical <code>OR</code> between the IP address and the bitwise inverse (NOT) of the Subnet Mask. This address is used to send data to all hosts on the subnet.</li>
          <li><strong>Usable Hosts:</strong> Calculated as <code>2^(32 - Prefix) - 2</code>. We subtract 2 because the Network Address and Broadcast Address cannot be assigned to hosts. (Exceptions: /31 networks allow 2 hosts under RFC 3021, and /32 is a single host route).</li>
        </ul>
      </div>
    </div>
  `;
  return el;
}

export function mount() {
  const ipInput = document.getElementById('ip-address');
  const cidrSelect = document.getElementById('cidr-suffix');
  const maskSelect = document.getElementById('subnet-mask');
  const errorMsg = document.getElementById('error-message');
  const resultDiv = document.getElementById('result');

  const cidrNotationDisplay = document.getElementById('cidr-notation-display');
  const netAddressDisplay = document.getElementById('net-address');
  const netBinaryDisplay = document.getElementById('net-binary');
  const broadcastAddressDisplay = document.getElementById('broadcast-address');
  const broadcastBinaryDisplay = document.getElementById('broadcast-binary');
  const usableRangeDisplay = document.getElementById('usable-range');
  const usableHostsDisplay = document.getElementById('usable-hosts');
  const totalHostsDetailDisplay = document.getElementById('total-hosts-detail');
  const wildcardMaskDisplay = document.getElementById('wildcard-mask');
  const wildcardBinaryDisplay = document.getElementById('wildcard-binary');
  const ipClassDisplay = document.getElementById('ip-class');
  const ipBinaryDisplay = document.getElementById('ip-binary');

  // List of standard subnet masks mapping to /0 to /32
  const masks = [
    "0.0.0.0",
    "128.0.0.0", "192.0.0.0", "224.0.0.0", "240.0.0.0", "248.0.0.0", "252.0.0.0", "254.0.0.0", "255.0.0.0",
    "255.128.0.0", "255.192.0.0", "255.224.0.0", "255.240.0.0", "255.248.0.0", "255.252.0.0", "255.254.0.0", "255.255.0.0",
    "255.255.128.0", "255.255.192.0", "255.255.224.0", "255.255.240.0", "255.255.248.0", "255.255.252.0", "255.255.254.0", "255.255.255.0",
    "255.255.255.128", "255.255.255.192", "255.255.255.224", "255.255.255.240", "255.255.255.248", "255.255.255.252", "255.255.255.254", "255.255.255.255"
  ];

  // Populate subnet mask select option list
  maskSelect.innerHTML = masks.map((mask, i) => `
    <option value="${i}" ${i === 24 ? 'selected' : ''}>${mask} (/${i})</option>
  `).join('');

  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc * 256) + parseInt(octet, 10), 0);
  }

  function intToIp(int) {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255
    ].join('.');
  }

  function getMaskForPrefix(prefix) {
    if (prefix === 0) return 0;
    return (~0 << (32 - prefix)) >>> 0;
  }

  function intToBinaryStr(int) {
    const str = (int >>> 0).toString(2).padStart(32, '0');
    return `${str.slice(0, 8)}.${str.slice(8, 16)}.${str.slice(16, 24)}.${str.slice(24, 32)}`;
  }

  function getIpClass(ipInt) {
    const firstOctet = (ipInt >>> 24) & 255;
    if (firstOctet === 127) return 'Loopback';
    if (firstOctet >= 1 && firstOctet <= 126) return 'Class A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
    if (firstOctet >= 240 && firstOctet <= 255) return 'Class E (Experimental)';
    return 'Unknown';
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    resultDiv.style.display = 'none';
  }

  function hideError() {
    errorMsg.style.display = 'none';
  }

  function calculate() {
    const ipVal = ipInput.value.trim();
    if (!ipVal) {
      resultDiv.style.display = 'none';
      hideError();
      return;
    }

    if (!ipRegex.test(ipVal)) {
      showError('Invalid IP Address format. Must be four octets (0-255) separated by dots (e.g. 192.168.1.1).');
      return;
    }

    hideError();

    const prefix = parseInt(cidrSelect.value, 10);
    const ipInt = ipToInt(ipVal);
    const maskInt = getMaskForPrefix(prefix);
    const wildcardInt = ~maskInt >>> 0;

    const netInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (ipInt | wildcardInt) >>> 0;

    // Display notation
    cidrNotationDisplay.innerHTML = `<span style="font-family: monospace;">${intToIp(ipInt)}/${prefix}</span>`;

    // Display details
    netAddressDisplay.textContent = intToIp(netInt);
    netBinaryDisplay.textContent = intToBinaryStr(netInt);

    broadcastAddressDisplay.textContent = intToIp(broadcastInt);
    broadcastBinaryDisplay.textContent = intToBinaryStr(broadcastInt);

    wildcardMaskDisplay.textContent = intToIp(wildcardInt);
    wildcardBinaryDisplay.textContent = intToBinaryStr(wildcardInt);

    ipClassDisplay.textContent = getIpClass(ipInt);
    ipBinaryDisplay.textContent = intToBinaryStr(ipInt);

    // Usable hosts & range calculation
    let usableFirst = 0;
    let usableLast = 0;
    let usableHostsCount = 0;

    if (prefix === 32) {
      usableFirst = ipInt;
      usableLast = ipInt;
      usableHostsCount = 1;
    } else if (prefix === 31) {
      usableFirst = netInt;
      usableLast = broadcastInt;
      usableHostsCount = 2; // RFC 3021
    } else {
      usableFirst = netInt + 1;
      usableLast = broadcastInt - 1;
      usableHostsCount = Math.max(0, Math.pow(2, 32 - prefix) - 2);
    }

    if (usableHostsCount > 0) {
      usableRangeDisplay.innerHTML = `<span style="font-family: monospace;">${intToIp(usableFirst)} - ${intToIp(usableLast)}</span>`;
      usableHostsDisplay.textContent = usableHostsCount.toLocaleString();
      totalHostsDetailDisplay.textContent = `2^${32 - prefix} ${prefix <= 30 ? '- 2' : ''} hosts`;
    } else {
      usableRangeDisplay.textContent = 'None';
      usableHostsDisplay.textContent = '0';
      totalHostsDetailDisplay.textContent = `No hosts available`;
    }

    resultDiv.style.display = 'block';
  }

  function handleCidrChange() {
    maskSelect.value = cidrSelect.value;
    calculate();
  }

  function handleMaskChange() {
    cidrSelect.value = maskSelect.value;
    calculate();
  }

  ipInput.addEventListener('input', calculate);
  cidrSelect.addEventListener('change', handleCidrChange);
  maskSelect.addEventListener('change', handleMaskChange);

  calculate();

  return () => {
    ipInput.removeEventListener('input', calculate);
    cidrSelect.removeEventListener('change', handleCidrChange);
    maskSelect.removeEventListener('change', handleMaskChange);
  };
}
