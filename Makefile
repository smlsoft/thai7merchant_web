build_docker_image_and_push:
	docker build -t smlsoft/dedeposmerchantweb .
	docker push smlsoft/dedeposmerchantweb

build_docker_image:
	yarn build
	docker build -t smlsoft/dedeposmerchantweb .

push_web_docker:
	docker push smlsoft/dedeposmerchantweb

run_web_docker:
	docker run --rm -p 8001:80 smlsoft/dedeposmerchantweb

run:
	yarn dev