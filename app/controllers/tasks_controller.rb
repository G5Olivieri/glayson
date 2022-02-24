# frozen_string_literal: true

class TasksController < RequireAuthController
  before_action :set_task, only: %i[show edit update destroy]

  def index; end

  def show
    authorize @task
  end

  def edit
    authorize @task
  end

  def done
    @tasks = Task.where(done: true)
      .and(
        Task.where(can_show: true)
          .or(Task.where(user: current_user))
      )
  end

  def todo
    @tasks = Task.where(done: false)
      .and(
        Task.where(can_show: true)
          .or(Task.where(user: current_user))
      )
  end

  def new
    @task = Task.new
    authorize @task
  end

  def create
    @task = Task.new(task_params)
    @task.user = current_user

    authorize @task

    respond_to do |format|
      if @task.save
        format.html { redirect_to task_url(@task), notice: 'Task was successfully created.' }
        format.json { render :show, status: :created, location: @task }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end


  def update
    respond_to do |format|
      if @task.update(task_params)
        format.html { redirect_to task_url(@task), notice: 'Task was successfully updated.' }
        format.json { render :show, status: :ok, location: @task }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @task.destroy

    respond_to do |format|
      format.html { redirect_to tasks_url, notice: 'Task was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:name, :done, :can_show, :can_edit, :can_destroy)
  end
end
