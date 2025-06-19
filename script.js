window.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.querySelector('.hero');
    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.zIndex = '0';

    const overlay = document.querySelector('.overlay-black');

    // Se veniamo da about.html
    const fromAbout = sessionStorage.getItem('fromAbout') === 'true';
    if (fromAbout) {
        camera.rotation.y = Math.PI / 2; // parte ruotata
        overlay.style.background = '#000';
        overlay.style.opacity = 1;
        gsap.to(camera.rotation, {
            y: 0,
            duration: 2,
            ease: 'power2.inOut',
        });
        gsap.to(overlay, {
            opacity: 0,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                sessionStorage.setItem('fromAbout', 'false');
            }
        });
    } else {
        overlay.style.opacity = 0;
    }

    // Animazioni testi in entrata
    const tl = gsap.timeline({ delay: 0.5 });
    tl.to('.headline', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out'
    })
        .to(
            '.subline',
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
            },
            '-=0.6'
        )
        .to(
            '.cta',
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
            },
            '-=0.4'
        );

    // Paralasse mouse e touch
    function updateParallax(xRatio, yRatio) {
        const isMobile = window.innerWidth < 768;
        const maxMove = isMobile ? 15 : 30;

        const x = (xRatio - 0.5) * maxMove;
        const y = (yRatio - 0.5) * maxMove;

        gsap.to('.content', {
            x,
            y,
            duration: 0.5,
            ease: 'power2.out',
        });
    }

    document.addEventListener('mousemove', (e) => {
        updateParallax(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    });
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            updateParallax(touch.clientX / window.innerWidth, touch.clientY / window.innerHeight);
        }
    });

    // Click sul bottone CTA con fade out testi e overlay
    const cta = document.querySelector('.cta');
    cta.addEventListener('click', (e) => {
        e.preventDefault();

        sessionStorage.setItem('fromIndex', 'true');
        sessionStorage.setItem('fromAbout', 'false');

        const tlOut = gsap.timeline();

        // Fade out testi e spostamento y
        tlOut.to(['.headline', '.subline', '.cta'], {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power2.inOut',
        });

        // Fade in overlay (nero)
        tlOut.to(
            overlay,
            {
                opacity: 1,
                duration: 2,
                ease: 'power2.inOut',
            },
            '-=1.5' // parte un po' prima che testi finiscano
        );

        // Ruota camera
        tlOut.to(
            camera.rotation,
            {
                y: camera.rotation.y - Math.PI / 2,
                duration: 2,
                ease: 'power2.inOut',
            },
            '-=2'
        );

        tlOut.call(() => {
            window.location.href = cta.href;
        });
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
