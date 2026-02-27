.PHONY: install build update zmk-pull zmk-push

install:
	npm install

build:
	npm run build

update:
	npm update karabiner.ts karabiner.ts-greg-mods

zmk-pull:
	git subtree pull --prefix=zmk zmk-config master --squash

zmk-push:
	git subtree push --prefix=zmk zmk-config master
