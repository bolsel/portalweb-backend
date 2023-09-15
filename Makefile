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
		--cache-from upiksaleh/portalweb-backend-app:$(version) \
		-t upiksaleh/portalweb-backend-app:$(version) \
		./app/
	docker tag upiksaleh/portalweb-backend-app:$(version) upiksaleh/portalweb-backend-app:latest

push-image: build-image
	docker push upiksaleh/portalweb-backend-app --all-tags

enter-image: init-app
	docker run \
		--rm \
		-it \
		upiksaleh/portalweb-backend-app:$(version) \
		/bin/sh
