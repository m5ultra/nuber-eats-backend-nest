import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto'
import { RestaurantsService } from './restaurants.service'
import { AuthUser } from '../guards/auth-user.decorator'
import { User } from '../users/entities/user.entity'
import { Restaurant } from './entities/restaurants.entity'
import { Role } from '../auth/role.decorator'
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto'
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto'
import { Category } from './entities/category.entity'
import { AllCategorysOutput } from './dtos/all-categorys.dto'
import { CategoryInput, CategoryOutput } from './dtos/category.dto'

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Mutation(() => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    )
  }

  @Mutation(() => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() authUser: User,
    @Args('input') editRestaurant: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(authUser, editRestaurant)
  }

  @Mutation(() => DeleteRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() authUser: User,
    @Args('input') { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(authUser, restaurantId)
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @ResolveField(() => Int)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurants(category)
  }

  @Query(() => AllCategorysOutput)
  allCategories(): Promise<AllCategorysOutput> {
    return this.restaurantService.allCategorys()
  }

  @Query(() => CategoryOutput)
  async category(
    @Args() categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput)
  }
}
