export function temp() {
    return (
        <div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
            <script>
                VANTA.NET(
                el: "#your-element-selector",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0xa33fff,
                backgroundColor: 0x19163b,
                points: 8.00,
                maxDistance: 21.00,
                spacing: 16.00
                )
            </script>
        </div>
    )
}