# frozen_string_literal: true

module Api
  class TasksController < ApplicationController
    def index
      @tasks = Task.all
      render json: @tasks
    end

    def show
      @task = Task.find(params[:id])
      render json: @task
    end

    def done
      @tasks = Task.where(done: true)
      render json: @tasks
    end

    def todo
      @tasks = Task.where(done: false)
      render json: @tasks
    end

    def create
      @task = Task.new(task_params)
      if @task.save
        redirect_to @task
      else
        render status: :unprocessable_entity
      end
    end

    def update
      @task = Task.find(params[:id])
      if @task.update(task_params)
        redirect_to @task
      else
        render status: :unprocessable_entity
      end
    end

    def destroy
      @task = Task.find(params[:id])
      @task.destroy
      render status: :no_content
    end

    private

    def task_params
      params.require(:task).permit(:name, :done)
    end
  end
end
