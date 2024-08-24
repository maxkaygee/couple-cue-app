# Contributing to Couple Cue App

First off, thank you for considering contributing to Couple Cue App! It's people like you that make it such a great tool for indies :3

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check this [Issues](https://github.com/maxkaygee/couple-cue-app/issues) page to see if someone else has already created a ticket. If not, go ahead and [make one](https://github.com/maxkaygee/couple-cue-app/issues/new)!

## Fork & create a branch

If this is something you think you can fix, then [fork Couple Cue App](https://help.github.com/articles/fork-a-repo) and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-japanese-localization
```

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first.

## Get the code

The first thing you'll need to do is get my code onto your machine. To do this, you'll need to "clone" the repository. Run this command in your terminal:

```sh
git clone https://github.com/maxkaygee/couple-cue-app.git
```

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with the latest Couple Cue App master branch:

```sh
git remote add upstream https://github.com/maxkaygee/couple-cue-app.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local master, and push it!

```sh
git checkout 325-add-japanese-localization
git rebase master
git push --set-upstream origin 325-add-japanese-localization
```

Finally, go to GitHub and [make a Pull Request](https://help.github.com/articles/creating-a-pull-request) :D

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing in Git, there are a lot of [good](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) [resources](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase) but here's the suggested workflow:

```sh
git checkout 325-add-japanese-localization
git pull --rebase upstream master
git push --force-with-lease 325-add-japanese-localization
```

## Code review

I will review your pull request and provide feedback. Please be patient as review times can vary.

## Thank you!

Thank you for your contribution! I very much appreciate your time and effort in making Couple Cue App better.
