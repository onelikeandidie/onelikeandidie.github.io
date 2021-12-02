// Import our fake light jquery
import $ from "./fake_jquery.module.js";
// Import 3D library
import * as THREE from "./external/three/three.module.js";
// Import the util for our lerp functions
import * as util from './util.module.js';
// Load the audio click file
let click_audio = new Audio('../assets/kenny.nl/click1.ogg');
// Check if the javascript is loaded
console.log("Hey, I'm alive");
// Select the canvas element
let canvas = $("#main #back_canvas");
// Select the buttons
/** @type {Element[]} */
let buttons = [
    $(".button-list #button_folio"),
    $(".button-list #button_games"),
    $(".button-list #button_about")
]
// Select the descriptions
/** @type {Element[]} */
let descriptions = [
    $(".menu-descriptions #description_folio"),
    $(".menu-descriptions #description_games"),
    $(".menu-descriptions #description_about")
]
/** I'm sure canvas is 1 element so I infer its type
 * @type {Element} */
let ctx = canvas;

let selected = undefined;
let selections = [
    {
        rotation: new THREE.Vector3(1, 1, 0)
    },
    {
        rotation: new THREE.Vector3(-1, 1, 1)
    },
    {
        rotation: new THREE.Vector3(1, -1, 2)
    }
]
let animation_state = 0;
/** @type {"idle" | "talk" | "poggers"} */
let current_state = "idle";
let states = {
    idle: {
        max_frames: 32,
    },
    talk: {
        max_frames: 0.5
    },
    poggers: {
        max_frames: 6
    }
}
/**
 * @param {number} index 
 * @param {bool} talk Wether to do the talk animation
 */
let select = function (index, talk = true) {
    if (selected == index) {
        return;
    }
    selected = index;
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const descrp = descriptions[i];
        if (i != index) {
            button.classList.remove("selected");
            descrp.classList.remove("show");
        } else {
            button.classList.add("selected");
            descrp.classList.add("show");
        }
    }
    if (talk) {
        current_state = "talk";
        click_audio.play();
    }
    update_scene();
}

let update_scene = function () {
    animation_state = 0;
    // Update 3D scene
}

let setup_hotkeys = function () {
    // Setup the hotkey listener 
    window.onkeyup = (event) => {
        /** @type {KeyboardEvent} */
        let key_event = event;
        console.log(key_event.key);
        // This will switch the currently selected section
        switch (key_event.key.toUpperCase()) {
            case "F":
                select(0);
                break;
            case "G":
                select(1);
                break;
            case "A":
                select(2);
                break;
            // Arrows requires an update based on the currently selected
            // Up is index subtraction
            // Down is index addition
            case "ARROWUP":
            case "ARROWLEFT":
                if (selected > 0) {
                    select(selected - 1);
                }
                break;
            case "ARROWDOWN":
            case "ARROWRIGHT":
                if (selected < (buttons.length - 1)) {
                    select(selected + 1);
                }
                break;
        
            default:
                break;
        }
    };
}

let setup_menu = function () {
    // This is called when a button is pressed
    let click_handler = (index) => {
        select(index);
    }
    // Setup the button events
    buttons[0].addEventListener("click", () => { click_handler(0) });
    buttons[1].addEventListener("click", () => { click_handler(1) });
    buttons[2].addEventListener("click", () => { click_handler(2) });
}

let setup_scene = function () {
    // Create the 3D scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, ctx.clientWidth / ctx.clientHeight, 0.1, 1000);
    // Create the renderer and append it to the canvas
    const renderer = new THREE.WebGL1Renderer();
    renderer.setSize(ctx.clientWidth, ctx.clientHeight);
    // Add the renderer to the window
    ctx.appendChild(renderer.domElement);
    // Light the scene
    const pointLight1 = new THREE.PointLight( 0xffffff );
    pointLight1.position.set( 500, 500, 500 );
    scene.add( pointLight1 );
    const pointLight2 = new THREE.PointLight( 0xffffff, 0.25 );
    pointLight2.position.set( - 500, - 500, - 500 );
    scene.add( pointLight2 );
    // Create a sample cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({color: 0xb9d7e4, flatShading: true});
    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    // Adjust Camera
    camera.position.z = 5;
    // Start the animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        // Animate cube
        let mf = 0;
        switch (current_state) {
            case "idle":
                mf = states.idle.max_frames;
                if (animation_state < mf) {
                    animation_state += 0.01;
                    cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01;
                } else {
                    animation_state = 0;
                }
                break;
        
            case "talk":
                mf = states.talk.max_frames;
                if (animation_state < mf) {
                    animation_state += 0.01;
                    let target_rot = selections[selected].rotation;
                    cube.rotation.x = util.lerp(cube.rotation.x, target_rot.x, animation_state);
                    cube.rotation.y = util.lerp(cube.rotation.y, target_rot.y, animation_state);
                    let target_scale = Math.max((Math.sin(animation_state / ( 1 / (Math.PI * 2)))) + 1, 1);
                    cube.scale.set(target_scale, target_scale, target_scale);
                } else {
                    current_state = "idle";
                }
                break;
        
            case "poggers":
                mf = states.poggers.max_frames;
                if (animation_state < mf) {
                    animation_state += 0.01;
                } else {

                }
                break;
        
            default:
                break;
        }
    }
    animate();
}

// Wait for the window to load, call the initializers
window.onload = function () {
    // Select the first button on load
    select(0, false);
    // Setup hotkeys
    setup_hotkeys();
    // Setup menu
    setup_menu();
    // Setup scene
    setup_scene();
}