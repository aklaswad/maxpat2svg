
# maxpat2svg

Generate cheep SVG copy from `*.maxpat` file, and help showing graphical diff for [Max](https://cycling74.com/products/max) patchers.

# Files

 - `maxpat2svg.js` - A main JavaScript code to convert maxpat to svg
 - `diff.html` - Web application page to show graphical diff for Max patchers
 - `diff.pl` - Glue script to open temporary HTML file for local git diff

# Install for local diff

 1. Clone this repository to your local machine
 2. Add this section to `~/.gitconfig` or project's `.git/config`

```gitconfig
[difftool "max"]
  cmd = '/path/to/maxpat2svg/diff.pl' $LOCAL $REMOTE
```

 3. Run diff via `git difftool`

```
$ git difftool -d -t max
```

# Show patcher diff on GitHub.com

diff.html can also read commit diffs from given URL.

```
diff.html?url=GITHUB_URL
```

Currently, only these URL forms are supported.

 - https://github.com/{Owner}/{Repo}/commit/{CommitHash}
 - https://github.com/{Owner}/{Repo}/pull/{PullNumber}(/*)?
 - https://github.com/{Owner}/{Repo}/compare/{oldsha}...{newsha}

Here is a bookmarklet to open online diff.html hosted on GitHub pages. Copy this snippet and save as bookmark.

```
javascript:window.open('https://aklaswad.github.io/maxpat2svg/?url=' + location.href, '_blank')
```

Or go to https://aklaswad.github.io/maxpat2svg/bookmarklet.html for Drag'n'drop.

> [!NOTE]
> Online plain HTML version has no authentication for GitHub, it means you will get a 60 requests/hour rate limit.

 - [ ] TODO - Provide a way to use diff.html with GitHub token