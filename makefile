s:
	$(MAKE) kill
	rm -rf apps/app/node_modules/.vite
	pnpm turbo run dev --filter=@tab/app --filter=@tab/api

reset:
	rm -rf .turbo
	rm -rf apps/app/node_modules/.vite
	pnpm install
	TURBO_UI=0 pnpm turbo run db:reset --force
	TURBO_UI=0 pnpm turbo build --force
	rm -rf libs/api-routes/dist
	pnpm turbo trpc --force

generate:
	TURBO_UI=0 pnpm turbo db:generate --force
	rm -rf libs/api-routes/dist
	TURBO_UI=0 pnpm turbo trpc

apply:
	TURBO_UI=0 pnpm turbo run @app/scripts#check-database-url
	TURBO_UI=0 pnpm turbo db:generate --force
	TURBO_UI=0 pnpm turbo db:deploy --force
	rm -rf libs/api-routes/dist
	TURBO_UI=0 pnpm turbo trpc --force

# Runs typecheck on all projects
ts:
	pnpm turbo ts

# Runs lints on all projects
lint:
	pnpm turbo lint

cleanup:
	find . -type d -name ".turbo" -prune -exec rm -rf {} +
	find . -type d -name "node_modules" -prune -exec rm -rf {} +
	find . -type d -name "dist" -prune -exec rm -rf {} +
	find . -type f -name ".env" -delete
	find . -type d -name "generated" -prune -exec rm -rf {} +
	
migrate:
	pnpm turbo run @tab/scripts#migrate

check-database-url:
	pnpm turbo run @tab/scripts#check-database-url