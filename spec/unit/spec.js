describe 'Webhooks'
  describe 'requesting the home page'
    it 'should greet the user'
      get("/").should be_successful
    end
  end
end
