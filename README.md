
# maxpat2svg

Generate cheep SVG copy from `*.maxpat` file for [Cycling '74 Max](https://cycling74.com/products/max) patchers.

And, this repository has a web implementation for showing graphical diff for patchers.

## Online version / show diffs for GitHub repositories

See online demo at https://aklaswad.github.io/maxpat2svg/?url=https://github.com/aklaswad/maxpat2svg/commit/fc7d694ff9238bd7e7bd159029783184a05cc626

Currently, these GitHub URL forms are supported.

 - https://github.com/{Owner}/{Repo}/commit/{CommitHash}
 - https://github.com/{Owner}/{Repo}/pull/{PullNumber}(/*)?
 - https://github.com/{Owner}/{Repo}/compare/{oldsha}...{newsha}

Here is a bookmarklet to open online diff.html hosted on GitHub pages. Copy this snippet and save as bookmark.

```
javascript:window.open('https://aklaswad.github.io/maxpat2svg/?url=' + location.href, '_blank')
```

Or go to https://aklaswad.github.io/maxpat2svg/bookmarklet.html for Drag'n'drop install.

> [!NOTE]
> Online plain HTML version has no authentication for GitHub, it means you will get a 60 requests/hour rate limit.

 - [ ] TODO - Provide a way to use diff.html with GitHub token


## Diff on local git

maxpat2svg can also show diffs for local git repository.

### Requirements

 - Max
 - git
 - bash

Currently, tested only with git-bash for windows.

### Set up for local git

 1. Clone this repository to your local machine
 2. Add this section to `~/.gitconfig` or project's `.git/config`

```gitconfig
[difftool "max"]
  cmd = '/path/to/maxpat2svg/maxdiff.sh' $LOCAL $REMOTE
```

 3. Open diff via `git difftool`

```
$ git difftool -d -t max
```

### How local diff works?

Currently, `maxdiff.sh` will start local web server via Node4Max (for just let Max users save time to install another node.js :grin: ). For first diff, it will take a few seconds to open the patcher, or launch Max itself.
While server is running, diff will be shown immediately so recommend to not close the opened patcher.

