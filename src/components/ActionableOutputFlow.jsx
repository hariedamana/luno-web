import hardwareBlueprint from "../assets/luno-hardware-blueprint.png";

export default function HardwareBlueprint() {
  return (
    <section className="hardware-blueprint-section">
      <div className="hardware-blueprint-container">
        <img
          src={hardwareBlueprint}
          alt="LUNO on-device hardware blueprint"
          className="hardware-blueprint-image"
        />
      </div>
    </section>
  );
}
