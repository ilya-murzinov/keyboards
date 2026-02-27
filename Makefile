.PHONY: install build update zmk-pull zmk-push

install:
	npm install

build:
	npm run build

update:
	npm update karabiner.ts karabiner.ts-greg-mods

zmk-remote:
	@git remote get-url zmk-config >/dev/null 2>&1 || git remote add zmk-config git@github.com:ilya-murzinov/zmk-config-totem-stable.git

zmk-pull: zmk-remote
	git subtree pull --prefix=zmk zmk-config master --squash

zmk-push: zmk-remote
	git subtree push --prefix=zmk zmk-config master
