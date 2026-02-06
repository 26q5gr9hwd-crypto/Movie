BT = chr(96)
DL = chr(36)
DOT = chr(46)

def fx(p, rs):
    c = open(p).read()
    for o, n in rs:
        c = c.replace(o, n)
    open(p, chr(119)).write(c)

i = DL + '{IMG}'
po = DL + '{POSTER}'
bd = DL + '{BACKDROP}'
pp = DL + '{movie' + DOT + 'poster_path}'
bp = DL + '{movie' + DOT + 'backdrop_path}'
mi = DL + '{movie' + DOT + 'id}'
mbp = DL + '{m' + DOT + 'backdrop_path}'
mpp = DL + '{m' + DOT + 'poster_path}'

fx('components/MovieCard.tsx', [
    ('? ' + i + po + pp + ' :', '? ' + BT + i + po + pp + BT + ' :'),
    ('href={/movie/' + mi + '}', 'href={' + BT + '/movie/' + mi + BT + '}'),
])

fx('components/HeroBanner.tsx', [
    ('? ' + i + bd + bp + ' :', '? ' + BT + i + bd + bp + BT + ' :'),
    ('href={/movie/' + mi + '}', 'href={' + BT + '/movie/' + mi + BT + '}'),
])

fx('app/movie/[id]/page.tsx', [
    ('path?' + i + bd + mbp + ':', 'path?' + BT + i + bd + mbp + BT + ':'),
    ('path?' + i + po + mpp + ':', 'path?' + BT + i + po + mpp + BT + ':'),
])