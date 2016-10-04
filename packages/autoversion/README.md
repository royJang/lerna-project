#AutoVersion

### 版本规则

1.0.0
1.0.0-alpha
1.0.0-alpha.2
1.0.0-beta
1.0.0-beta.2
1.0.0-rc
1.0.0-rc.2
1.0.0-release
1.0.0-release.2

### api

> 自动升级版本
```
av auto
1.0.0 => 1.0.1
1.0.0-alpha => 1.0.0-alpha.1
```

> 指定版本
```
av ap 1.0.0 => 1.0.0
av ap 1.0.0-rc.2 => 1.0.0-rc.2
```

> 指定alpha版本
```
av alpha 1.0.0 => 1.0.0-alpha
```

>指定beta版本
```
av alpha 1.0.0 => 1.0.0-beta
```

>指定rc版本
```
av rc 1.0.0 => 1.0.0-rc
```

>指定release版本
```
av release 1.0.0 => 1.0.0-release
```