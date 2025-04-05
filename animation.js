// Three.js Galaxy Animation
const container = document.getElementById('canvas-container');

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Camera position
camera.position.z = 15;

// Create galaxy particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;

const posArray = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
  // Position
  posArray[i] = (Math.random() - 0.5) * 50;
  
  // Colors
  if(i % 3 === 0) {
    colors[i] = Math.random() * 0.5 + 0.5; // R (higher values)
  } else if(i % 3 === 1) {
    colors[i] = Math.random() * 0.5; // G (lower values)
  } else {
    colors[i] = Math.random() * 0.8 + 0.2; // B (higher values)
  }
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Materials
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  transparent: true,
  opacity: 0.8,
  vertexColors: true,
  blending: THREE.AdditiveBlending
});

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Add some stars (different size)
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 1000;

const starsPositions = new Float32Array(starsCount * 3);
const starsSizes = new Float32Array(starsCount);

for(let i = 0; i < starsCount * 3; i += 3) {
  starsPositions[i] = (Math.random() - 0.5) * 100;
  starsPositions[i + 1] = (Math.random() - 0.5) * 100;
  starsPositions[i + 2] = (Math.random() - 0.5) * 100;
  
  starsSizes[i/3] = Math.random() * 0.1 + 0.05;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
starsGeometry.setAttribute('size', new THREE.BufferAttribute(starsSizes, 1));

const starsMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  color: 0xffffff,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending
});

const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starsMesh);

// Animation
const clock = new THREE.Clock();

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scroll animation for navbar
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime();
  
  // Smooth follow for mouse movement
  targetX = mouseX * 0.2;
  targetY = mouseY * 0.2;
  
  particlesMesh.rotation.y += 0.003;
  particlesMesh.rotation.x += 0.001;
  
  starsMesh.rotation.y += 0.0005;
  starsMesh.rotation.x += 0.0002;
  
  // Mouse follow with delay
  particlesMesh.rotation.y += (targetX - particlesMesh.rotation.y) * 0.01;
  particlesMesh.rotation.x += (targetY - particlesMesh.rotation.x) * 0.01;
  
  starsMesh.rotation.y += (targetX - starsMesh.rotation.y) * 0.005;
  starsMesh.rotation.x += (targetY - starsMesh.rotation.x) * 0.005;
  
  renderer.render(scene, camera);
}

animate();