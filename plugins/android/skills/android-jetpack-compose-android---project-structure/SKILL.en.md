---
name: android-jetpack-compose-android---project-structure-en
description: Use when working with Android Jetpack Compose — project architecture, module structure, clean architecture
---

- 项目结构:

app/
  src/
    main/
      java/com/package/
        data/
          repository/
          datasource/
          models/
        domain/
          usecases/
          models/
          repository/
        presentation/
          screens/
          components/
          theme/
          viewmodels/
        di/
        utils/
      res/
        values/
        drawable/
        mipmap/
    test/
    androidTest/
