SHELL=bash

.PHONY: init-app

init-app:
	$(eval version := $(shell node -e 'console.log(require("./app/package.json").version)'))

pack-app: init-app
	pnpm install
	pnpm --filter @portalweb/* build
	node scripts/app-pack.js

start-app: init-app
	pnpm run -C ./app start

build-image: pack-app
	docker build \
		--cache-from bolsel/portalweb-backend:$(version) \
		-t bolsel/portalweb-backend:$(version) \
		./app/
	docker tag bolsel/portalweb-backend:$(version) bolsel/portalweb-backend:latest

push-image: build-image
	docker push bolsel/portalweb-backend --all-tags

enter-image: init-app
	docker run \
		--rm \
		-it \
		bolsel/portalweb-backend:$(version) \
		/bin/sh
