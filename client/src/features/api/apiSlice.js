import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://tourbackend-z83w.onrender.com/api/v1',
  }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/tours',
      providesTags: ['Post'],
    }),
    addNewPost: builder.mutation({
      query: (payload) => {
        // console.log('zzz',payload)
        const body = JSON.stringify({

          name: payload.title,
          summary: payload.body,
          duration: 9,
          maxGroupSize: 20,
          difficulty: "easy",
          price: 1197,
          imageCover: "tour-4-cover.jpg",
        })
        return {
          url: '/tours',
          method: 'POST',
          body,
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }
      },
      invalidatesTags: ['Post'],
    }),
    updatePost: builder.mutation({
      query: (payload) => {
        const { id, body, title } = payload
        const patch = {
          summary: body,
          name: title
        };
        // console.log('zzz2',patch)
        return {
          url: `/tours/${id}`,
          method: 'PATCH',
          body: patch,
        }
      },
      invalidatesTags: ['Post'],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/tours/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['Post'],
    }),
  }),
})

export const {
  useGetPostsQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = apiSlice
