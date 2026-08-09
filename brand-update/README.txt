Geography Ninja brand update
=============================

Copy into the geoninja app root:

public/geography-ninja-logo.webp -> geoninja/public/geography-ninja-logo.webp
src/BrandShell.jsx              -> geoninja/src/BrandShell.jsx
src/brand.css                   -> geoninja/src/brand.css
src/main.jsx                    -> geoninja/src/main.jsx (replace existing)

Then:
npm run build

Commit/push to main. If geographyninja.com is connected to this Vercel project,
the push should trigger deployment.

Brand palette:
Navy deep #05263D
Navy      #073552
Blue      #075985
Green     #78B82A
Green dark#5E941D
Cream     #FBFAF5
