import { Test } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { PostsModule } from './posts.module';

describe('PostsService', () => {
  let postsService: PostsService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PostsModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    postsService = moduleRef.get<PostsService>(PostsService);
    prismaMock = moduleRef.get<DeepMockProxy<PrismaClient>>(PrismaService);
  });

  it('should have the service defined', () => {
    expect(postsService).toBeDefined();
  });

  describe('findAll', () => {
    beforeEach(() => {
      jest.spyOn(prismaMock.post, 'findMany');
    });

    it('should be defined', () => {
      expect(postsService.findAll).toBeDefined();
    });

    it('should be called', () => {
      postsService.findAll({});

      expect(prismaMock.post.findMany).toBeCalledTimes(1);
    });

    it('should return posts', async () => {
      const mockPosts = [
        {
          id: '22',
          title: 'Title',
          body: 'Body title',
          authorId: '10',
          authorName: 'Name',
          createdAt: new Date(),
          updatedAt: null,
          comments: undefined,
        },
      ];
      prismaMock.post.findMany.mockResolvedValueOnce(mockPosts);

      const posts = await postsService.findAll({});

      expect(posts).toBe(mockPosts);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      jest.spyOn(prismaMock.post, 'create');
    });

    it('should be defined', () => {
      expect(postsService.create).toBeDefined();
    });

    it('should be called', () => {
      const mockPost = {
        author: {},
        authorName: 'Name',
        title: 'Title',
        body: 'Body title',
      };
      postsService.create(mockPost);

      expect(prismaMock.post.create).toBeCalledTimes(1);
    });
  });
});
