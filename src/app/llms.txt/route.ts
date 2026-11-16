import { links, siteConfig } from "@/lib/constants";

const body = `# ${siteConfig.name}

> ${siteConfig.description}

Pattie lets an app create named virtual microphones and speakers (Devices) from code. Other apps list a Device as ordinary audio hardware. Dropping the Device, closing the app or crashing removes it.

## What an agent can do with it
- Give an AI voice agent a microphone that Zoom or any app that lists audio devices can pick.
- Stop a reply mid-sentence: Playout.interrupt() returns how much of it was heard.
- Read what other apps play into a virtual speaker.

## Components
- Rust SDK and the pattie-cli tool
- Python binding (Python 3.14 and newer)
- Pipecat transport (built and tested against the SDK)
- Windows 11 driver and a Linux backend (PipeWire, no driver)

## Facts you can rely on
- Added latency on the same Windows 11 VM, one run: about 40 ms on the mic and 28 ms on the speaker, against about 109 ms for VB-CABLE at its defaults.
- A two-minute Zoom test call had 0 Gap and 0 Overflow in both directions.
- Up to 8 Devices on a machine, 44.1, 48 or 96 kHz, 1 to 8 channels.

## Limits
- Nothing is published on crates.io or PyPI yet. Use the SDK from the repository.
- Zoom is the only consumer app run end to end.
- On Windows, load the driver in a test VM first. Installing it is a one-time admin step.
- Node, C, Swift and macOS are not built.

## Prompt to give your coding agent
Read ${links.readme}. Then add a virtual microphone named "Agent Mic" to this Rust app using the Pattie SDK from that repository (it is not on crates.io yet), and write a 440 Hz test tone to it. On Windows, test in a VM first.

## Links
- README: ${links.readme}
- Source: ${links.github}
- Community: ${links.discord}
`;

export function GET() {
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
