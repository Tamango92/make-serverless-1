If you have run npm install not under linux environment,
this lambda-function probably won't work after deploy.

That is because 'sharp' module uses binaries which were build in
the incorrect environment.

To resolve it - follow this guide:
https://github.com/lovell/sharp/issues/1054
