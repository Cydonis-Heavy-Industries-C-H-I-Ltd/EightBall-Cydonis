import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
// Corrected: Imports from the 'addons' directory for modern three.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// GSAP is loaded via a script tag to prevent build/runtime errors.
/*
          _       _        _          _                  _                _                    _             _        
        /\ \     /\ \     /\_\       /\ \               /\ \             /\ \     _           /\ \          / /\      
       /  \ \    \ \ \   / / /      /  \ \____         /  \ \           /  \ \   /\_\         \ \ \        / /  \     
      / /\ \ \    \ \ \_/ / /      / /\ \_____\       / /\ \ \         / /\ \ \_/ / /         /\ \_\      / / /\ \__  
     / / /\ \ \    \ \___/ /      / / /\/___  /      / / /\ \ \       / / /\ \___/ /         / /\/_/     / / /\ \___\ 
    / / /  \ \_\    \ \ \_/      / / /   / / /      / / /  \ \_\     / / /  \/____/         / / /        \ \ \ \/___/ 
   / / /    \/_/     \ \ \      / / /   / / /      / / /   / / /    / / /    / / /         / / /          \ \ \       
  / / /               \ \ \    / / /   / / /      / / /   / / /    / / /    / / /         / / /       _    \ \ \      
 / / /________         \ \ \   \ \ \__/ / /      / / /___/ / /    / / /    / / /      ___/ / /__     /_/\__/ / /      
/ / /_________\         \ \_\   \ \___\/ /      / / /____\/ /    / / /    / / /      /\__\/_/___\    \ \/___/ /       
\/____________/          \/_/    \/_____/       \/_________/     \/_/     \/_/       \/_________/     \_____\/        
                                                                                                                      
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@BBB@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.    @@@@@BBBBB@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@,.  _@@@@@           "=@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                "+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                    '4@@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@B@@@@@@@@@@@@@@@@@@@@@@@@                       "B@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@"      9@@@@@@@@B.     'B@@@@@@@ga____.               %@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@         9@@@@@@@.       .@@@@@@@@@@@@@@g__              %@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@         @@@@@@@@.       .@@@@@@@@@@@@@@@@@@@_,            0@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@_    . j@@@@@@@@g_.    _@@@@@@@@@@@@@@@@@@@@@@g_.          '@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@_           @@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@           @@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@a          @@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'  _.   %@@@@@@@@@@@@@P'""""`@@@@@@@@g.        .@@@@@@@@@@@
[@@@@@@@@@@@@@F      B@@@@@@F .+@@@@_.  B@@@@@@@@@@@|      @@@@@@@@@A.         @@@@@@@@@@
[@@"   \@@@@@         @@@@@@  !@@@@@@;  .@@@T.---- Vg_.   j@'----..B@j         [@@@@@@@@@
[@@.   ,@@@@@         &@@@@B   B@@@@P   .@@@||      @@|   @@|     [|@@,         @@@@@@@@@
[@@@@@@@@@@@@@,      j@@@@@@,          .J@@@||      @@|   @@|     [|@@]         @@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@g_       _@@@@@||      --    --      [|@@@         [@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ggggg@@@@@@@||     ___'   ___     [|@@@         [@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@||      --.   --,     [|@@@         [@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@P"     "%@@@@@||      @@|   @@|     [|@@@         [@@@@@@@@
[@@@@@@@@@@@@@N     "@@@@@@@F   ...    '@@@@||      @@|   @@|     [|@@@         @@@@@@@@@
[@@"   \@@@@@"        @@@@@@  .g@@@@_.  .@@@1.===== P.    "@L.====='@@)         @@@@@@@@@
[@@.    @@@@@         [@@@@B  !@@@@@@!  '@@@@@@@@@@@|      @@@@@@@@@@P         ,@@@@@@@@@
[@@@ggg@@@@@@B       _@@@@@@   0@@@@f   !@@@@@@@@@@@ggggggg@@@@@@@@@@          @@@@@@@@@@
[@@@@@@@@@@@@@@@~~~J@@@@@@@@@_         A@@@@@@@@@@@@@@@@@@@@@@@@@@@@"         j@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@g~~~~~@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@          _@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@N          _@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@W"         .+@@@@@@@@@@@@@
[@@@@@@@@@@@@@W"'  "4@@@@@@@@@@P"   "4@@@@@@@@@@@@@@@@@@@@@@@P"          .g@@@@@@@@@@@@@@
[@@@@@@@@@@@@?        @@@@@@@@'       '@@@@@@@@@@@@@@@@@@@@"            ,@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@         [@@@@@@B.       .@@@@@@@@@@@@@@@@P"            ..g@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@B        @@@@@@@@_       J@@@@@@@@@@@=>'               ,g@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@~___~g@@@@@@@@@@g~___~@@@@@                        _@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                    ._/@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@                 __g@@@@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@P"""9@@@@@           ..__@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@.    @@@@@l__-___gg@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@g___g@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
[@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
*/
// --- Shaders for visual effects ---

// Rippling effect for the skybox
const skyboxVertexShader = `
  uniform float time;
  varying vec3 vNormal;
  
  // Perlin noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vNormal = normal;
    float displacement = snoise(normal + time * 0.1) * 0.1;
    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const skyboxFragmentShader = `
  uniform float time;
  varying vec3 vNormal;

  // Added missing helper functions for snoise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    float noise = snoise(vNormal * 2.0 + time * 0.2);
    vec3 color1 = vec3(0.4, 0.1, 0.6); // Deep Purple
    vec3 color2 = vec3(0.8, 0.3, 0.9); // Lighter Purple
    vec3 finalColor = mix(color1, color2, (noise + 1.0) / 2.0);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Glitter effect for the 8-ball
const glitterVertexShader = `
  varying vec3 vNormal; varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glitterFragmentShader = `
  uniform float time;
  varying vec3 vNormal; varying vec3 vPosition;
  float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
    float glitter = step(0.99, rand(vNormal.xy * 1000.0 + time) * 0.5);
    vec3 baseColor = vec3(0.95, 0.85, 0.1);
    vec3 glitterColor = vec3(1.0, 1.0, 0.7);
    vec3 finalColor = baseColor + glitter * glitterColor;
    finalColor = mix(finalColor, vec3(0.8, 0.6, 1.0), fresnel * 0.3);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const Magic8Ball = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const ballRef = useRef(null);
    const fortuneContainerRef = useRef(new THREE.Object3D());
    const textMeshRef = useRef(null);
    const fontRef = useRef(null);
    
    // State to track asset loading and shaking status
    const [isFontLoaded, setIsFontLoaded] = useState(false);
    const [isGsapLoaded, setIsGsapLoaded] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const fortunes = useMemo(() => [
        "It is certain.", "It is decidedly so.", "Without a doubt.", "Yes, definitely.",
        "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.",
        "Yes.", "Signs point to yes.", "The Power Of Cydonis compels you! ^_^v", "Reply hazy, try again.", "Ask again later.",
        "Better not tell you now.", "Amanda Loves Cake! And You!", "Cannot predict now.", "Concentrate and ask again.",
        "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.",
        "Very doubtful."
    ], []);

    // Main setup effect for Three.js scene
    useEffect(() => {
        const scene = sceneRef.current;
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        cameraRef.current = camera;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 2;
        controls.maxDistance = 15;
        controls.enablePan = false;
        controlsRef.current = controls;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const skyboxGeo = new THREE.SphereGeometry(50, 32, 32);
        const skyboxMat = new THREE.ShaderMaterial({
            vertexShader: skyboxVertexShader, fragmentShader: skyboxFragmentShader,
            uniforms: { time: { value: 0 } }, side: THREE.BackSide,
        });
        const skybox = new THREE.Mesh(skyboxGeo, skyboxMat);
        scene.add(skybox);

        const ballGroup = new THREE.Group();
        const ballGeo = new THREE.SphereGeometry(1.5, 64, 64);
        const ballMat = new THREE.ShaderMaterial({
            vertexShader: glitterVertexShader, fragmentShader: glitterFragmentShader,
            uniforms: { time: { value: 0 } },
        });
        const ballMesh = new THREE.Mesh(ballGeo, ballMat);
        ballGroup.add(ballMesh);
        
        const innerGeo = new THREE.SphereGeometry(1.4, 32, 32);
        const innerMat = new THREE.MeshStandardMaterial({ color: 0x050515, roughness: 0.1, metalness: 0 });
        const innerSphere = new THREE.Mesh(innerGeo, innerMat);
        ballGroup.add(innerSphere);
        
        fortuneContainerRef.current.position.set(0, 0, 0);
        ballGroup.add(fortuneContainerRef.current);
        
        ballRef.current = ballGroup;
        scene.add(ballGroup);

        // FIX: Correctly structured animation loop
        let animationFrameId;
        const clock = new THREE.Clock();
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            if(skybox.material.uniforms.time) skybox.material.uniforms.time.value = elapsedTime;
            if(ballMesh.material.uniforms.time) ballMesh.material.uniforms.time.value = elapsedTime;
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!currentMount) return;
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            if (currentMount && renderer.domElement) {
                 currentMount.removeChild(renderer.domElement);
            }
        };
    }, []);

    // Asset loading effects
    useEffect(() => {
        // Load GSAP
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js';
        script.async = true;
        script.onload = () => setIsGsapLoaded(true);
        script.onerror = () => console.error('GSAP script failed to load.');
        document.head.appendChild(script);

        // Load Font
        const fontLoader = new FontLoader();
        fontLoader.load(
            'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
            (loadedFont) => {
                fontRef.current = loadedFont;
                const textMat = new THREE.MeshBasicMaterial({ color: 0xADEFD1, transparent: true, opacity: 0, side: THREE.DoubleSide });
                const textGeo = new TextGeometry('', { font: loadedFont, size: 0.1, height: 0.01 });
                const textMesh = new THREE.Mesh(textGeo, textMat);
                textMeshRef.current = textMesh;
                fortuneContainerRef.current.add(textMesh);
                setIsFontLoaded(true);
            },
            undefined, 
            (error) => console.error('An error occurred loading the font:', error)
        );

        return () => {
            // Cleanup script tag on component unmount
            const scriptTag = document.querySelector(`script[src="${script.src}"]`);
            if (scriptTag) {
                document.head.removeChild(scriptTag);
            }
        };
    }, []);

    // Shake ball function
    const shakeBall = () => {
        if (isShaking || !isFontLoaded || !isGsapLoaded || !textMeshRef.current || !ballRef.current) return;
        setIsShaking(true);

        const ball = ballRef.current;
        const textMesh = textMeshRef.current;
        const gsap = window.gsap; // Access GSAP from window object

        gsap.to(textMesh.material, { opacity: 0, duration: 0.25 });

        gsap.to(ball.rotation, {
            x: `+=${Math.random() * 4 - 2}`, y: `+=${Math.random() * 4 - 2}`,
            z: `+=${Math.random() * 4 - 2}`, duration: 1, ease: "power1.inOut",
            onComplete: () => {
                const newFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
                
                const newGeo = new TextGeometry(newFortune, {
                    font: fontRef.current, size: 0.15, height: 0.02, curveSegments: 12,
                });
                newGeo.center();
                textMesh.geometry.dispose();
                textMesh.geometry = newGeo;

                const targetQuaternion = new THREE.Quaternion();
                fortuneContainerRef.current.lookAt(cameraRef.current.position);
                targetQuaternion.copy(fortuneContainerRef.current.quaternion);

                gsap.to(fortuneContainerRef.current.quaternion, {
                    x: targetQuaternion.x, y: targetQuaternion.y,
                    z: targetQuaternion.z, w: targetQuaternion.w,
                    duration: 1.5, ease: "elastic.out(1, 0.5)",
                });
                
                gsap.to(textMesh.material, { opacity: 1, duration: 1, delay: 0.5 });
                
                fortuneContainerRef.current.position.y = 0.7; // Start floating up
                gsap.to(fortuneContainerRef.current.position, {
                    y: 0, duration: 2.5, ease: "bounce.out", delay: 0.5,
                    onComplete: () => setIsShaking(false)
                });
            }
        });
    };
    
    const buttonText = isFontLoaded && isGsapLoaded ? "🔮 Shake Ball" : "Loading Assets...";

    return (
        <div className="relative w-full h-screen bg-black">
            <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                <button
                    onClick={shakeBall}
                    disabled={!isFontLoaded || !isGsapLoaded || isShaking}
                    className="px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:scale-100"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default function App() {
    return <Magic8Ball />;
}
