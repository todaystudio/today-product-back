import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CategoryService } from './category.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Controller('category')
@ApiTags('Category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth()
	async create(@Body() dto: CreateCategoryDto) {
		return this.categoryService.create(dto)
	}

	@Get()
	async findAll() {
		return this.categoryService.findAll()
	}

	@Get('by-id/:id')
	@Auth()
	async findOneById(@Param('id') id: string) {
		return this.categoryService.findOneById(+id)
	}

	@Get('/:slug')
	async findOneBySlug(@Param('slug') slug: string) {
		return this.categoryService.findOneBySlug(slug)
	}

	@UsePipes(new ValidationPipe())
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateCategoryDto: UpdateCategoryDto
	) {
		return this.categoryService.update(+id, updateCategoryDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.categoryService.remove(+id)
	}
}
