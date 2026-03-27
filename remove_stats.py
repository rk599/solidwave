with open('src/pages/de/index.astro') as f:
    c = f.read()

start = c.find('\n  <section class="sw-stats reveal">')
end = c.find('\n  <section id="services"')
c = c[:start] + c[end:]

with open('src/pages/de/index.astro', 'w') as f:
    f.write(c)
print('done')
