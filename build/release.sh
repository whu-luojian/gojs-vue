#! /bin/bash

read -p "Make sure it has been builded and committed, ready to release? (y/n)" -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]
then
  # 指定上线版本
  echo "inpput version: "
  read VERSION

  read -p "current version: $VERSION - are you sure? (y/n)" -n 1 -r
  echo    

  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    # 修改版本号
    yarn version --new-version $VERSION --no-git-tag-version --allow-same-version

    # 打 tag && 生成变更日志
    git tag v$VERSION
    yarn changelog
    git commit -am "release: $VERSION" --no-verify

    # 提交代码
    git push origin master
    git push origin refs/tags/v$VERSION
  else
    echo 'release canceled'
  fi

else
  echo 'release canceled, please bulid and commit first!'
fi

