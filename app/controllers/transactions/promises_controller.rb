# frozen_string_literal: true

module Transactions
  class PromisesController < RequireAuthController
    before_action :set_promise, only: %i[show edit update destroy]

    # GET /promises or /promises.json
    def index
      @promises = TransactionPromise.all
      respond_to do |format|
        format.html { render :index }
        format.json { render json: @promises }
      end
    end

    # GET /promises/1 or /promises/1.json
    def show
      authorize @promise
    end

    # GET /promises/new
    def new
      @promise = TransactionPromise.new
      @promise.build_recurring
      authorize @promise
    end

    # GET /promises/1/edit
    def edit
      authorize @promise
    end

    # POST /promises or /promises.json
    def create
      @promise = TransactionPromise.new(promise_params_without_recurring)
      @promise.build_recurring(recurring_params)
      authorize @promise

      respond_to do |format|
        if @promise.save
          format.html { redirect_to @promise, notice: 'TransactionPromise was successfully created.' }
          format.json { render :show, status: :created, location: @promise }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @promise.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /promises/1 or /promises/1.json
    def update
      authorize @promise
      respond_to do |format|
        if @promise.recurring.nil?
          @promise.build_recurring(recurring_params)
        else
          @promise.recurring.update(recurring_params)
        end
        if @promise.update(promise_params_without_recurring)
          format.html { redirect_to @promise, notice: 'TransactionPromise was successfully updated.' }
          format.json { render :show, status: :ok, location: @promise }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @promise.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /promises/1 or /promises/1.json
    def destroy
      authorize @promise

      @promise.destroy

      respond_to do |format|
        format.html { redirect_to transaction_promises_url, notice: 'TransactionPromise was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_promise
      @promise = TransactionPromise.find(params[:id])
    end

    def promise_params
      params.require(:promise).permit(:name, :transaction_type, :date, :amount, :transaction_promise_id, recurring: [:start_date, :limit, :days])
    end

    def recurring_params
      recurring = promise_params()[:recurring]
      recurring[:days] = recurring[:days].split(',')
      recurring
    end

    def promise_params_without_recurring
      data = promise_params
      data.delete(:recurring)
      data
    end
  end
end
