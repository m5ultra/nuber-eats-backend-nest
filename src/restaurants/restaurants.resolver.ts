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
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dot'
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dot'
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-restaurant.dto'

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

  @Query(() => RestaurantOutput)
  @Role(['Owner'])
  async allRestaurants(
    @Args('input') restaurantsInput: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.allRestaurants(restaurantsInput)
  }

  @Query(() => RestaurantOutput)
  @Role(['Owner'])
  async findRestaurantById(
    @Args('input') restaurantInput: RestaurantInput,
  ): Promise<RestaurantOutput> {
    return this.restaurantService.findRestaurantById(restaurantInput)
  }

  // Search by keywords
  @Query(() => SearchRestaurantOutput)
  searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurant(searchRestaurantInput)
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  // TODO 在category增加restaurantCount属性 不太好理解
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
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput)
  }
}
