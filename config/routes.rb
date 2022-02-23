# frozen_string_literal: true

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  root 'home#index'

  resources :notes
  resources :transactions

  namespace :tasks do
    get :done, :todo
  end
  resources :tasks

  namespace :api do
    resources :tasks
    resources :transactions
    resources :notes
    namespace :tasks do
      get :done, :todo
    end
  end
end
