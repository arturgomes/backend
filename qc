git add .
if [ !$1 ]; 
  then git commit -m "quick commit";
  else git commit -m "$1";
fi
git push
