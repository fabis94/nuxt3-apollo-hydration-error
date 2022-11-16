# Nuxt3 apollo hydration error repro

1. `yarn`
1. `yarn dev`
1. open http://localhost:4545/hydration-test
1. check console and you'll see the error

It seems that SSR renders everything correctly, and CSR also does, but only on 2nd render pass. On initial render, even tho the Apollo cache is filled, it returns undefined at first, which causes Vue to report that there's a hydration mismatch.
