cd auth
npm install $1
cd ..

cd tickets
npm install $1
cd ..

cd orders
npm install $1
cd ..

cd expiration
npm install $1
cd ..

git add ./auth/package.json
git add ./auth/package-lock.json

git add ./tickets/package.json
git add ./tickets/package-lock.json

git add ./orders/package.json
git add ./orders/package-lock.json

git add ./expiration/package.json
git add ./expiration/package-lock.json

git commit -m "Bump to $1"
