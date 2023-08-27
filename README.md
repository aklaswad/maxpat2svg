
# maxpat2svg

Generate cheep SVG copy from `*.maxpat` file, and help showing graphical diff for [Max](https://cycling74.com/products/max) patchers.

# INSTALL

 1. Clone this repository to your local
 2. Add this section to `~/.gitconfig` or project's `.git/config`

```gitconfig
[difftool "max"]
  cmd = '/path/to/maxpat2svg/diff.pl' $LOCAL $REMOTE
```

 3. Run diff from `git difftool`

```
$ git difftool -d -t max
```