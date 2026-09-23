/**
 * Chapter 3 — AI-first development (§3.2). The chapter 2 system, moved aside
 * and wrapped in a harness: an agent with its tools. The same service stalls
 * again; this time the agent reads the failure and patches it, the request
 * completes, and a bot notifies a phone. Narration is an agent log line (R13).
 *
 *   t 0.00–0.15  system shrinks to the right; harness draws round it
 *   t 0.08–0.22  agent and tools appear, tool edges draw
 *   t 0.24–0.40  request travels to the integrations box
 *   t 0.40–0.64  that box is the fault
 *   t 0.46–0.70  agent lights; its edge to the fault draws
 *   t 0.56–0.64  log line
 *   t 0.64–0.72  box patched
 *   t 0.66–0.80  request completes
 *   t 0.80–0.92  bot → phone, notification
 *   t 0.90–1.00  closing note
 */

import { chapter3Scene as copy } from '../../content/home';
import { PARTS } from '../motif/anchors';
import { axisPoint, easeInOut, easeOut, lerp, partPoint, ramp, type MotifParams, type Point } from '../motif/kinematics';
import { serviceTags, SYSTEM_POSE } from './chapter-2';
import {
  between,
  circlePath,
  partialPolyline,
  pointAlong,
  pulse,
  rectPath,
  type MarkState,
  type Scene,
  type SceneFrame,
} from './scene';

const STALL = PARTS.findIndex((p) => p.id === 'housing');
const LAST = PARTS.length - 1;

const HARNESS_POSE: MotifParams = { ...SYSTEM_POSE, cx: 640, scale: 0.78, spread: 36 };

const HARNESS = { x: 40, y: 150, w: 820, h: 720 };
const AGENT: Point = { x: 350, y: 500 };
const AGENT_R = 40;
const TOOL_X = 185;
const TOOL_YS = [280, 410, 590, 720] as const;
const TOOL_R = 16;
const PHONE = { x: 890, y: 740, w: 64, h: 130 };
const DOT_R = 11;

function evaluate(t: number): SceneFrame {
  const settle = easeInOut(ramp(t, 0, 0.15));
  const motif: MotifParams = {
    ...SYSTEM_POSE,
    cx: lerp(SYSTEM_POSE.cx, HARNESS_POSE.cx, settle),
    scale: lerp(SYSTEM_POSE.scale, HARNESS_POSE.scale, settle),
    spread: lerp(SYSTEM_POSE.spread, HARNESS_POSE.spread, settle),
  };

  const partState: MarkState[] = PARTS.map((_, i) => {
    if (i === STALL && between(t, 0.4, 0.64)) return 'fault';
    if (i === STALL && between(t, 0.64, 0.72)) return 'active';
    if (i === LAST && t >= 0.8) return 'active';
    return null;
  });
  const frame: SceneFrame = { motif, partState, marks: [], tags: [], captions: [] };

  /* The system keeps its service names; they ride along as it moves aside. */
  frame.tags.push(...serviceTags(motif, 1));

  /* Harness. */
  const { x, y, w, h } = HARNESS;
  const outline: Point[] = [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h },
    { x, y },
  ];
  frame.marks.push({
    key: 'harness',
    cls: 'dg-harness',
    d: partialPolyline(outline, easeOut(ramp(t, 0, 0.15))),
    opacity: t > 0 ? 1 : 0,
  });
  frame.tags.push({
    key: 'tag-harness',
    text: copy.tags.harness,
    x: x,
    y: y - 14,
    anchor: 'start',
    opacity: ramp(t, 0.1, 0.15),
  });

  /* Agent and tools: edges first so the nodes paint over their ends. */
  const nodes = ramp(t, 0.08, 0.16);
  const edges = easeOut(ramp(t, 0.12, 0.22));
  TOOL_YS.forEach((ty, i) => {
    frame.marks.push({
      key: `edge-tool-${i}`,
      cls: 'dg-edge',
      d: partialPolyline([{ x: TOOL_X, y: ty }, AGENT], edges),
      opacity: edges > 0 ? 1 : 0,
    });
  });

  const stallLeft = partPoint(motif, STALL, -1, 0.5);
  const agentEdge = easeOut(ramp(t, 0.46, 0.56));
  frame.marks.push({
    key: 'edge-agent-fault',
    cls: 'dg-edge',
    d: partialPolyline([{ x: AGENT.x + AGENT_R, y: AGENT.y }, stallLeft], agentEdge),
    opacity: agentEdge > 0 ? 1 : 0,
    state: 'active',
  });

  TOOL_YS.forEach((ty, i) => {
    frame.marks.push({
      key: `tool-${i}`,
      cls: 'dg-node',
      d: circlePath({ x: TOOL_X, y: ty }, TOOL_R),
      opacity: nodes,
      state: i === 3 && between(t, 0.8, 0.92) ? 'active' : null,
    });
    frame.tags.push({
      key: `tag-tool-${i}`,
      text: copy.tags.tools[i] ?? '',
      x: TOOL_X,
      y: ty - TOOL_R - 12,
      anchor: 'middle',
      opacity: nodes,
    });
  });

  frame.marks.push({
    key: 'agent',
    cls: 'dg-node',
    d: circlePath(AGENT, AGENT_R),
    opacity: nodes,
    state: between(t, 0.46, 0.7) ? 'active' : null,
  });
  frame.tags.push({
    key: 'tag-agent',
    text: copy.tags.agent,
    x: AGENT.x,
    y: AGENT.y + AGENT_R + 32,
    anchor: 'middle',
    opacity: nodes,
  });

  /* The request: down to the stall, waits for the patch, then completes. */
  const leg1: Point[] = [axisPoint(motif, 0), partPoint(motif, STALL, 0, 0)];
  const leg2: Point[] = [partPoint(motif, STALL, 0, 0), axisPoint(motif, 1)];
  const dot =
    t < 0.66
      ? pointAlong(leg1, easeInOut(ramp(t, 0.24, 0.4)))
      : pointAlong(leg2, easeInOut(ramp(t, 0.66, 0.8)));
  frame.marks.push({
    key: 'request',
    cls: 'dg-dot',
    d: circlePath(dot, DOT_R),
    opacity: pulse(t, 0.22, 0.24),
    state: between(t, 0.4, 0.64) ? 'fault' : null,
  });

  /* Bot → phone. The route runs under the harness to the phone. */
  const botRoute: Point[] = [
    { x: TOOL_X, y: (TOOL_YS[3] ?? 0) + TOOL_R },
    { x: TOOL_X, y: 930 },
    { x: PHONE.x + PHONE.w / 2, y: 930 },
    { x: PHONE.x + PHONE.w / 2, y: PHONE.y + PHONE.h },
  ];
  const bot = easeOut(ramp(t, 0.8, 0.88));
  frame.marks.push(
    {
      key: 'bot-route',
      cls: 'dg-flow',
      d: partialPolyline(botRoute, bot),
      opacity: bot > 0 ? 1 : 0,
    },
    {
      key: 'phone',
      cls: 'dg-node',
      d: rectPath(PHONE.x, PHONE.y, PHONE.w, PHONE.h),
      opacity: nodes,
    },
    {
      key: 'phone-notification',
      cls: 'dg-notify',
      d: rectPath(PHONE.x + 8, PHONE.y + 18, PHONE.w - 16, 14),
      opacity: ramp(t, 0.88, 0.92),
    },
  );

  frame.captions.push(
    { key: 'log', text: copy.captions.log, opacity: ramp(t, 0.56, 0.64), tone: 'log' },
    { key: 'closing', text: copy.captions.closing, opacity: ramp(t, 0.9, 1) },
  );

  return frame;
}

export const chapter3: Scene = {
  id: 'chapter-3',
  description: copy.description,
  buildT: 1,
  staticT: 1,
  evaluate,
};
