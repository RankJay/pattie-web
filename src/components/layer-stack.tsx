import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SIZE = 20;

const THICK = 1;

const CUBE = 3;

const GAP = 17;

const CENTER_X = 15;

const CENTER_Y = 37;

const COS = Math.SQRT1_2;

const TILT_Y = 0.5;

const TILT_Z = 0.866;

const z = { windows: 0, driver: GAP, app: GAP * 2 };

const spots = [
  { x: 2.5, y: 14.5 },
  { x: 12.5, y: 12.5 },
  { x: 14.5, y: 2.5 },
];

const spotKeys = ["left", "center", "right"] as const;

interface Point {
  x: number;
  y: number;
}

function project(x: number, y: number, height: number): Point {
  const rx = x - SIZE / 2;
  const ry = y - SIZE / 2;

  return {
    x: CENTER_X + (rx * COS - ry * COS),
    y: CENTER_Y + (rx * COS + ry * COS) * TILT_Y - height * TILT_Z,
  };
}

const face = "absolute top-0 left-0 border border-brown [transform-origin:0_0]";

const slabTones = {
  light: { top: "bg-slab-top", left: "bg-slab-left", right: "bg-slab-right" },
  amber: { top: "bg-amber", left: "bg-slab-amber-left", right: "bg-slab-amber-right" },
};

const cubeTones = {
  dark: { top: "bg-cube-top", left: "bg-cube-left", right: "bg-cube-right" },
  light: { top: "bg-cream", left: "bg-slab-left", right: "bg-slab-right" },
};

interface SlabProps {
  height: number;
  tone: keyof typeof slabTones;
  children: React.ReactNode;
}

function Slab({ height, tone, children }: SlabProps) {
  const t = slabTones[tone];

  return (
    <div
      className="absolute inset-0 [transform-style:preserve-3d]"
      style={{ transform: `translateZ(${height}em)` }}
    >
      <span
        className={cn(face, "size-full", t.top)}
        style={{ transform: `translateZ(${THICK}em)` }}
      />
      <span
        className={cn(face, "w-full", t.left)}
        style={{
          height: `${THICK}em`,
          transform: `translateY(${SIZE}em) translateZ(${THICK}em) rotateX(-90deg)`,
        }}
      />
      <span
        className={cn(face, "w-full", t.right)}
        style={{
          height: `${THICK}em`,
          transform: `translateX(${SIZE}em) translateZ(${THICK}em) rotateZ(90deg) rotateX(-90deg)`,
        }}
      />
      {children}
    </div>
  );
}

interface CubeProps {
  spot: Point;
  tone: keyof typeof cubeTones;
  className?: string;
}

function Cube({ spot, tone, className }: CubeProps) {
  const t = cubeTones[tone];
  const side = `${CUBE}em`;

  return (
    <div
      className={cn("absolute [transform-style:preserve-3d]", className)}
      style={{
        left: `${spot.x}em`,
        top: `${spot.y}em`,
        width: side,
        height: side,
        transform: `translateZ(${THICK}em)`,
      }}
    >
      <span className={cn(face, "size-full", t.top)} style={{ transform: `translateZ(${side})` }} />
      <span
        className={cn(face, "size-full", t.left)}
        style={{ transform: `translateY(${side}) translateZ(${side}) rotateX(-90deg)` }}
      />
      <span
        className={cn(face, "size-full", t.right)}
        style={{
          transform: `translateX(${side}) translateZ(${side}) rotateZ(90deg) rotateX(-90deg)`,
        }}
      />
    </div>
  );
}

interface WireProps {
  spot: Point;
  from: number;
  to: number;
  live: boolean;
}

function Wire({ spot, from, to, live }: WireProps) {
  const cx = spot.x + CUBE / 2 - 0.06;
  const cy = spot.y + CUBE / 2;

  return (
    <span
      className={cn(
        "absolute top-0 left-0 w-[0.12em] [transform-origin:0_0]",
        live
          ? "[background:repeating-linear-gradient(to_bottom,var(--color-border)_0_0.3em,transparent_0.3em_0.6em)] group-has-checked/life:animate-[flow-em_0.7s_linear_infinite] group-has-checked/life:[background:repeating-linear-gradient(to_bottom,var(--color-amber)_0_0.3em,transparent_0.3em_0.6em)]"
          : "opacity-50 [background:repeating-linear-gradient(to_bottom,var(--color-muted-foreground)_0_0.3em,transparent_0.3em_0.6em)]",
      )}
      style={{
        height: `${to - from}em`,
        transform: `translate3d(${cx}em, ${cy}em, ${to}em) rotateX(-90deg)`,
      }}
    />
  );
}

const cubeCentre = project(
  spots[1].x + CUBE / 2,
  spots[1].y + CUBE / 2,
  z.driver + THICK + CUBE / 2,
);

const chipAnchor: Point = { x: 7.5, y: 30 };

const chipDx = cubeCentre.x - chipAnchor.x;

const chipDy = cubeCentre.y - chipAnchor.y;

const chipLength = Math.hypot(chipDx, chipDy);

const chipAngle = (Math.atan2(chipDy, chipDx) * 180) / Math.PI;

const layers = [
  {
    key: "app",
    name: "YOUR APP",
    short: "Rust · Python · CLI",
    body: "Rust, Python or the CLI creates a Device and writes samples. Close or crash and the Device is dropped.",
    height: z.app,
  },
  {
    key: "driver",
    name: "PATTIE DRIVER",
    short: "named Devices over a shared Ring",
    body: "Kernel mode, one cube per Device. Its core reads the Ring and counts any Gap or Overflow, and its shell publishes each Device to Windows.",
    height: z.driver,
  },
  {
    key: "windows",
    name: "WINDOWS AUDIO",
    short: "any app that lists devices",
    body: "Apps see each Device as an ordinary microphone. Zoom is the app we have run end to end.",
    height: z.windows,
  },
];

export function LayerStack() {
  return (
    <Card className="min-w-0 p-5 sm:p-7">
      <p className="text-muted-foreground mb-4 font-mono text-[11px] tracking-[0.15em]">
        THE LAYERS · MICROPHONE
      </p>
      <div className="@container">
        <div aria-hidden="true" className="relative mx-auto h-[47em] w-[30em] text-[2cqw] xl:mx-0">
          <div
            className="absolute [transform-style:preserve-3d]"
            style={{
              left: "5em",
              top: "27em",
              width: `${SIZE}em`,
              height: `${SIZE}em`,
              transform: "rotateX(60deg) rotateZ(45deg)",
            }}
          >
            <Slab height={z.windows} tone="light">
              {spots.map((spot, i) => (
                <Cube key={spotKeys[i]} spot={spot} tone="light" />
              ))}
            </Slab>
            <Slab height={z.driver} tone="amber">
              <Cube spot={spots[0]} tone="dark" />
              <Cube spot={spots[1]} tone="light" className="hidden group-has-checked/life:block" />
              <Cube spot={spots[2]} tone="dark" />
            </Slab>
            <Slab height={z.app} tone="light">
              {spots.map((spot, i) => (
                <Cube key={spotKeys[i]} spot={spot} tone="dark" />
              ))}
            </Slab>
            {spots.map((spot, i) => (
              <span key={spotKeys[i]} className="contents">
                <Wire spot={spot} from={z.driver + THICK + CUBE} to={z.app} live={i === 1} />
                <Wire spot={spot} from={z.windows + THICK + CUBE} to={z.driver} live={i === 1} />
              </span>
            ))}
          </div>
          <div className="hidden xl:block">
            {layers.map((layer) => {
              const corner = project(SIZE, 0, layer.height + THICK);

              return (
                <div key={layer.key}>
                  <span
                    className="bg-muted-foreground absolute h-px"
                    style={{
                      left: `${corner.x}em`,
                      top: `${corner.y}em`,
                      width: `${33 - corner.x}em`,
                    }}
                  />
                  <div
                    className="absolute w-[16em]"
                    style={{ left: "33.5em", top: `${corner.y}em`, transform: "translateY(-50%)" }}
                  >
                    <b className="font-display text-foreground block text-[15px] font-extrabold tracking-wide">
                      {layer.name}
                    </b>
                    <span className="text-muted-foreground mt-1 block font-mono text-[12px] leading-snug">
                      {layer.short}
                    </span>
                  </div>
                </div>
              );
            })}
            <span
              className="bg-muted-foreground absolute hidden h-px origin-left group-has-checked/life:block"
              style={{
                left: `${chipAnchor.x}em`,
                top: `${chipAnchor.y}em`,
                width: `${chipLength}em`,
                transform: `rotate(${chipAngle}deg)`,
              }}
            />
            <span
              className="bg-amber text-brown absolute hidden -translate-x-full -translate-y-1/2 px-2.5 py-1 font-mono text-[12px] group-has-checked/life:block"
              style={{ left: `${chipAnchor.x}em`, top: `${chipAnchor.y}em` }}
            >
              Agent Mic
            </span>
          </div>
        </div>
      </div>
      <ol className="mt-5 flex flex-col gap-4 xl:sr-only">
        {layers.map((layer) => (
          <li key={layer.key} className="border-border flex flex-col gap-1 border-t pt-4">
            <b className="font-display text-foreground text-base font-extrabold tracking-wide">
              {layer.name}
            </b>
            <p className="text-muted-foreground text-sm leading-normal">{layer.body}</p>
          </li>
        ))}
        <li className="border-border flex flex-col gap-1 border-t pt-4">
          <b className="font-display text-foreground text-base font-extrabold tracking-wide">
            THE RING
          </b>
          <p className="text-muted-foreground text-sm leading-normal">
            The vertical wires are the Ring: 32-bit float frames in shared memory, with no system
            call per buffer.{" "}
            <span className="text-amber-ink hidden font-mono group-has-checked/life:inline">
              Microphone (Agent Mic) is in the device list.
            </span>
            <span className="group-has-checked/life:hidden">
              Agent Mic is not in the device list.
            </span>
          </p>
        </li>
      </ol>
    </Card>
  );
}
