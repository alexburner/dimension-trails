# dimension trails

Spreading orbital motion through 01234D & time

### Current state

[![](https://i.imgur.com/hk5H6sWl.png)](https://alexburner.github.io/dimension-trails)

### Design draft

Source simulations - [https://alexburner.github.io/dimensions](https://alexburner.github.io/dimensions)

[![](https://i.imgur.com/vMd7suLl.png)](https://i.imgur.com/vMd7suL.png)

### Related links

> - [Molecular Machinery of Life](http://doorofperception.com/2015/12/david-s-goodsell-the-machinery-of-life/) | David S. Goodsell
> - [Consciousness, Creativity, and the Brain](https://www.youtube.com/watch?v=z2UHLMVr4vg&feature=youtu.be&t=41) | David Lynch
> - [Consciousness - Awareness as Attention](https://aeon.co/essays/how-consciousness-works-and-why-we-believe-in-ghosts) | Michael Graziano
> - [Consciousness as a State of Matter](https://medium.com/the-physics-arxiv-blog/why-physicists-are-saying-consciousness-is-a-state-of-matter-like-a-solid-a-liquid-or-a-gas-5e7ed624986d) | Max Tegmark
> - [Quantum Graphity](http://nautil.us/issue/32/space/lets-rethink-space) | Fotini Markopoulou
> - [Spacetime - Emergence from 4D Networks](http://blog.stephenwolfram.com/2015/12/what-is-spacetime-really/) | Stephen Wolfram
> - [Spacetime & Causality - 4D Non-Euclidean Mathematical Space](https://www.youtube.com/watch?v=YycAzdtUIko) | PBS Digital Studios

# development

## install

Install npm dependencies

```sh
npm install
```

## dev

Run dev server + watch (outputs to `dev/`)

```sh
npm run dev
npm run clean # busts .cache/ dev/
```

## tsc

Run TypeScript compiler + watch (no emit, types only)

```sh
npm run tsc
```

## format

Run `prettier` and `tslint --fix`

```sh
npm run format # prettier + tslint
npm run prettier
npm run tslint
```

## build

Run production build (outputs to `docs/`)

```sh
npm run build
```
