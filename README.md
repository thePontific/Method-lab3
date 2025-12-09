# 📘 Методичка по разработке CRUD‑сервиса на **NestJS + TypeORM**

Добро пожаловать! Эта методичка шаг за шагом проведёт тебя через создание полноценного CRUD‑сервиса на NestJS с использованием PostgreSQL, TypeORM, DTO, валидации, пайплайна, репозиториев и тестирования в Postman.

> 🔧 Картинки, схемы и диаграммы ты вставишь сама — здесь подготовлен структурированный и красиво оформленный текст.

---

# 📑 Оглавление

1. [Введение](#введение)
2. [Что такое API и REST](#что-такое-api-и-rest)
3. [Описание проекта](#описание-проекта)
4. [Установка и структура проекта](#установка-и-структура-проекта)
5. [Настройка подключения к PostgreSQL](#настройка-подключения-к-postgresql)
6. [Создание Сущностей (Entity)](#создание-сущностей-entity)
7. [Создание DTO](#создание-dto)
8. [Сервис и бизнес‑логика](#сервис-и-бизнеслогика)
9. [Репозиторий](#репозиторий)
10. [Контроллер и маршруты](#контроллер-и-маршруты)
11. [Валидация и пайпы](#валидация-и-пайпы)
12. [Типовые ответы сервера](#типовые-ответы-сервера)
13. [Postman/Insomnia — тестирование API](#postmaninsomnia--тестирование-api)
14. [Ошибки, коды ответов и плохие кейсы](#ошибки-коды-ответов-и-плохие-кейсы)
15. [Swagger — автодокументация API](#swagger--автодокументация-api)
16. [Критерии оценки проекта](#критерии-оценки-проекта)
17. [Контрольные вопросы](#контрольные-вопросы)
18. [Полезные ссылки](#полезные-ссылки)

---

# Введение

Эта методичка поможет вам научиться создавать backend‑сервисы на **NestJS** — современном TypeScript‑фреймворке, который следует лучшим практикам архитектуры: модули, провайдеры, контроллеры, DI, разделение слоёв и тестируемость.

Мы разработаем сервис управления товарами (CRUD):

* получить список
* получить элемент по ID
* создать
* обновить
* удалить

Полностью с использованием:

* **NestJS** (Контроллеры, Сервисы, Модули)
* **PostgreSQL**
* **TypeORM** (Entities + Repository)
* **class-validator + class-transformer** (валидация)
* **DTO**
* **Swagger**

---

# Что такое API и REST

**API** — это интерфейс, с помощью которого одна программа взаимодействует с другой.

**REST API** — архитектурный стиль, построенный на:

* HTTP методах (`GET`, `POST`, `PUT`, `DELETE`)
* URL‑ресурсах (`/products`, `/products/:id`)
* передаче данных в JSON

Пример REST‑маршрутов:

* `GET /products` — получить список
* `POST /products` — создать
* `GET /products/:id` — получить по ID
* `PUT /products/:id` — обновить
* `DELETE /products/:id` — удалить

---

# Описание проекта

Будем делать сервис "Склад". Каждый товар имеет:

* `id`: number
* `name`: string
* `description`: string | null
* `price`: number
* `quantity`: number
* `createdAt`: datetime

> Добавь картинку ER‑диаграммы, если хочешь.

---

# Установка и структура проекта

```bash
npm i -g @nestjs/cli
nest new stock-service
cd stock-service
```

Структура:

```
src/
  modules/
    products/
      products.controller.ts
      products.service.ts
      products.module.ts
      dto/
      entities/
      repository/
```

---

# Настройка подключения к PostgreSQL

Установим зависимости:

```bash
npm install pg typeorm @nestjs/typeorm
```

Создадим `app.module.ts` подключение:

```ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'stockdb',
  autoLoadEntities: true,
  synchronize: true,
});
```

---

# Создание Сущностей (Entity)

Пример: `product.entity.ts`

```ts
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column('numeric', {
    transformer: {
      to: (value) => value,
      from: (value) => parseFloat(value),
    },
  })
  price: number;

  @Column()
  quantity: number;
}
```

---

# Создание DTO

```ts
export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsInt()
  quantity: number;
}
```

```ts
export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

---

# Сервис и бизнес‑логика

```ts
@Injectable()
export class ProductsService {
  constructor(private repo: ProductsRepository) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneOrFail(id);
  }

  create(dto: CreateProductDto) {
    return this.repo.createAndSave(dto);
  }

  update(id: number, dto: UpdateProductDto) {
    return this.repo.updateAndSave(id, dto);
  }

  remove(id: number) {
    return this.repo.softDelete(id);
  }
}
```

---

# Репозиторий

```ts
@Injectable()
export class ProductsRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  createAndSave(dto: CreateProductDto) {
    const entity = this.create(dto);
    return this.save(entity);
  }

  updateAndSave(id: number, dto: UpdateProductDto) {
    return this.save({ id, ...dto });
  }
}
```

---

# Контроллер и маршруты

```ts
@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
```

---

# Валидация и пайпы

Подключение глобальной валидации в `main.ts`:

```ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  transform: true,
}));
```

---

# Типовые ответы сервера

| Метод  | Ресурс        | Описание   | Код     |
| ------ | ------------- | ---------- | ------- |
| GET    | /products     | список     | 200     |
| GET    | /products/:id | один товар | 200/404 |
| POST   | /products     | создать    | 201     |
| PUT    | /products/:id | обновить   | 200/404 |
| DELETE | /products/:id | удалить    | 200/404 |

---

# Postman/Insomnia — тестирование API

Добавь скриншоты запросов.

Примеры JSON:

```json
{
  "name": "Laptop",
  "description": "Gaming",
  "price": 49999.99,
  "quantity": 5
}
```

---

# Ошибки, коды ответов и плохие кейсы

* `400` — неверный JSON
* `404` — товар не найден
* `409` — конфликт данных
* `500` — внутренняя ошибка

---

# Swagger — автодокументация API

```ts
const config = new DocumentBuilder()
  .setTitle('Products API')
  .setVersion('1.0')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

После запуска:

```
http://localhost:3000/api
```

---

# Критерии оценки проекта

* корректная структура NestJS
* рабочий CRUD
* валидация DTO
* корректные ответы сервера
* Postman коллекция
* чистый и читаемый код
* наличие Swagger

---

# Контрольные вопросы

1. Что такое DTO и зачем он нужен?
2. Что такое Entity и как работает TypeORM?
3. Чем отличается сервис от контроллера?
4. Что такое DI (Dependency Injection)?
5. Что делает ValidationPipe?
6. Отличие `PUT` от `PATCH`?

---

# Полезные ссылки

* [https://nestjs.com](https://nestjs.com)
* [https://typeorm.io](https://typeorm.io)
* [https://www.postman.com](https://www.postman.com)
* [https://swagger.io](https://swagger.io)

---

# 🎉 Готово!

Теперь у тебя есть красиво оформленный README для GitHub, останется только вставить изображения, скриншоты и UML‑диаграммы.
