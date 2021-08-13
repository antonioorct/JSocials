dir=$(pwd)
server_dir="$dir"/server
web_dir="$dir"/web

rm -rf "$web_dir"/build
rm -rf "$server_dir"/build
rm -rf "$server_dir"/front-end
rm -rf "$web_dir"/node_modules
rm -rf "$server_dir"/node_modules

cd $web_dir

yarn install --frozen-lockfile
yarn build
mv "$web_dir"/build "$server_dir"/build
mv "$server_dir"/build "$server_dir"/front-end

cd $server_dir

yarn install --frozen-lockfile

cd $dir
